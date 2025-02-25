import { create } from "zustand";

export const useBattleStore = create()((set) => ({
  activeBattle: null,
  setActiveBattle: (activeBattle) =>
    set((state) => ({ ...state, activeBattle })),
}));
