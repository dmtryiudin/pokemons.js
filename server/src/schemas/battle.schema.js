import { Schema, model } from "mongoose";

const battleSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  userPokemon: { type: Number, required: true },
  botPokemon: { type: Number, required: true },

  starts: {
    type: String,
    enum: ["bot", "user"],
    required: true,
  },
  attacks: [
    {
      damage: { type: Number, required: true },
    },
  ],
});

export const BattleModel = model("Battle", battleSchema);
