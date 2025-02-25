import { LOCAL_STORAGE_TOKEN } from "../types/consts";
import { AuthApi } from "../types/endpoints";
import { api } from "../utils/api";
import Web3 from "web3";

export class AuthService {
  static async authenticate() {
    const { data: oneTimeStringData } = await api.get(AuthApi.ONE_TIME_STRING);

    const { originalValue, valueToSign } = oneTimeStringData;

    const web3 = new Web3(window.ethereum);
    const accounts = await web3.eth.getAccounts();
    const signer = accounts[0];

    const signedValue = await web3.eth.personal.sign(valueToSign, signer, "");

    const { data: authResponse } = await api.post(AuthApi.AUTH, {
      originalValue,
      valueToSign,
      signer,
      signedValue,
    });

    localStorage.setItem(LOCAL_STORAGE_TOKEN, authResponse.token);

    return authResponse.user;
  }
}
