import { Schema, model } from "mongoose";

const signedValueSchema = new Schema({
  signedValue: { type: String, required: true, unique: true },
});

export const SignedValueModel = model("SignedValue", signedValueSchema);
