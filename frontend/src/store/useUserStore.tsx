import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface UserState {
  id: string | null;
  name: string | null;
  email: string | null;
  image?: string | null;
  accessToken: string | null;
  role: string | null;
  department_name?: string | null;
  department_id?: string | null;
  setUser: (user: Partial<UserState>) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      id: null,
      name: null,
      email: null,
      image: null,
      accessToken: null,
      role: null,
      department_name: null,
      department_id: null,
      setUser: (user) => set((state) => ({ ...state, ...user })),
      clearUser: () =>
        set({
          id: null,
          name: null,
          email: null,
          image: null,
          accessToken: null,
          role: null,
          department_name: null,
          department_id: null,
        }),
    }),
    {
      name: "user-storage", // unique name for localStorage
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
