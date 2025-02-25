import { Schema, model } from "mongoose";

const publicKeySchema = new Schema({
  ethereumIdentifier: { type: String, required: true, unique: true },
  winsCount: { type: Number, required: true, default: 0 },
});

export const UserModel = model("User", publicKeySchema);
