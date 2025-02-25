import { BattleApi } from "../types/endpoints";
import { api } from "../utils/api";

export class BattleService {
  static async startBattle(pokemonId) {
    const { data: newBattle } = await api.post(
      `${BattleApi.START_BATTLE}/${pokemonId}`
    );

    return newBattle;
  }

  static async restoreBattle() {
    try {
      const { data: battle } = await api.get(`${BattleApi.RESTORE_BATTLE}`);

      return battle;
    } catch (e) {
      const errorCode = e?.response?.data?.code;

      if (errorCode === 404) {
        throw new Error("User doesn't have an active battle");
      }

      throw new Error("Failed to restore a battle");
    }
  }

  static async attack() {
    const { data: updatedBattle } = await api.post(`${BattleApi.ATTACK}`);

    return updatedBattle;
  }
}
