import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";
import { EnvService } from "./env.service.js";
import { CustomException } from "../utils/custom-exception.util.js";
import { ethers } from "ethers";
import jwt from "jsonwebtoken";
import { SignedValueModel } from "../schemas/signed-value.schema.js";
import { UserModel } from "../schemas/user.schema.js";
import { GetUserDto } from "../dtos/get-user.dto.js";

export class AuthService {
  static valueToSignKey = EnvService.getValues().VALUE_TO_SIGN_KEY;

  static generateOneTimeString() {
    const originalValue = uuidv4();

    const valueToSign = crypto
      .createHmac("sha256", this.valueToSignKey)
      .update(originalValue)
      .digest("hex");

    return { originalValue, valueToSign };
  }

  static verifyOneTimeString(originalValue, valueToSign) {
    const newValueToSign = crypto
      .createHmac("sha256", this.valueToSignKey)
      .update(originalValue)
      .digest("hex");

    return newValueToSign === valueToSign;
  }

  static async verifySignature(message, signedValue, signer) {
    const messageHash = ethers.hashMessage(message);
    const recoveredAddress = ethers.recoverAddress(messageHash, signedValue);
    return recoveredAddress.toLowerCase() === signer.toLowerCase();
  }

  static async auth(originalValue, valueToSign, signedValue, signer) {
    const foundSignedValue = await SignedValueModel.exists({ signedValue });

    if (foundSignedValue) {
      throw CustomException.badRequestException(
        "Signed value was already used"
      );
    }

    const isOneTimeStringCorrect = this.verifyOneTimeString(
      originalValue,
      valueToSign
    );

    if (!isOneTimeStringCorrect) {
      throw CustomException.badRequestException("Value to sign is invalid");
    }

    const isSignatureValid = await this.verifySignature(
      valueToSign,
      signedValue,
      signer
    );

    if (!isSignatureValid) {
      throw CustomException.badRequestException("Signed value is invalid");
    }

    await SignedValueModel.create({ signedValue });

    let user = await UserModel.findOne({ ethereumIdentifier: signer });

    if (!user) {
      user = new UserModel({ ethereumIdentifier: signer });

      await user.save();
    }

    const token = jwt.sign(
      { id: user._id },
      EnvService.getValues().JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    return { token, user: { ...new GetUserDto(user) } };
  }

  static async verifyJwtToken(token) {
    try {
      const tokenData = jwt.verify(
        token,
        EnvService.getValues().JWT_SECRET_KEY
      );

      const userId = tokenData.id;

      const foundUser = await UserModel.findById(userId);

      if (!foundUser) {
        throw CustomException.unauthorizedException("Invalid token");
      }

      return foundUser;
    } catch {
      throw CustomException.unauthorizedException("Invalid token");
    }
  }
}
