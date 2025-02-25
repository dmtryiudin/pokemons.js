import { USER_STORAGE } from "../types/consts";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useUserStore = create()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set((state) => ({ ...state, user })),
    }),
    {
      name: USER_STORAGE,
    }
  )
);
