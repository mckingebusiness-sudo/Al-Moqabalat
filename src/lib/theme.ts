import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "dark" | "light";

export const useTheme = create<{ theme: Theme; toggle: () => void; set: (t: Theme) => void }>()(
  persist(
    (set, get) => ({
      theme: "dark",
      toggle: () => {
        const next = get().theme === "dark" ? "light" : "dark";
        set({ theme: next });
        if (typeof document !== "undefined") {
          document.documentElement.classList.toggle("dark", next === "dark");
        }
      },
      set: (theme) => {
        set({ theme });
        if (typeof document !== "undefined") {
          document.documentElement.classList.toggle("dark", theme === "dark");
        }
      },
    }),
    { name: "ix-theme" },
  ),
);
