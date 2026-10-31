import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type ThemeMode = "dark" | "light";

export type AppColors = {
  bg: string;
  bgElevated: string;
  bgCard: string;
  line: string;
  text: string;
  muted: string;
  accent: string;
  accentDim: string;
  accent2: string;
  fixed: string;
  fixedDim: string;
  danger: string;
  warn: string;
  like: string;
  pass: string;
  crush: string;
  crushDim: string;
  gradientA: string;
  gradientB: string;
  heroScrim: string;
  phoneDesktop: string;
};

const dark: AppColors = {
  bg: "#0a0c12",
  bgElevated: "#141824",
  bgCard: "#1a1f2e",
  line: "rgba(255, 214, 232, 0.14)",
  text: "#f7f3f8",
  muted: "#a9a0b5",
  accent: "#ff6b9d",
  accentDim: "rgba(255, 107, 157, 0.18)",
  accent2: "#5ec8ff",
  fixed: "#5ec8ff",
  fixedDim: "rgba(94, 200, 255, 0.14)",
  danger: "#ff7a6e",
  warn: "#ffd166",
  like: "#ff4d8d",
  pass: "#8b93a7",
  crush: "#ff8f5a",
  crushDim: "rgba(255, 143, 90, 0.2)",
  gradientA: "#ff6b9d",
  gradientB: "#6b8cff",
  heroScrim: "rgba(8, 6, 14, 0.72)",
  phoneDesktop: "#05060a",
};

const light: AppColors = {
  bg: "#fbf7fb",
  bgElevated: "#ffffff",
  bgCard: "#ffffff",
  line: "rgba(40, 20, 50, 0.1)",
  text: "#1a1424",
  muted: "#6d6478",
  accent: "#e84d82",
  accentDim: "rgba(232, 77, 130, 0.12)",
  accent2: "#2f8fe8",
  fixed: "#2f8fe8",
  fixedDim: "rgba(47, 143, 232, 0.12)",
  danger: "#e2554a",
  warn: "#d4a017",
  like: "#e84d82",
  pass: "#8a8494",
  crush: "#f0753a",
  crushDim: "rgba(240, 117, 58, 0.14)",
  gradientA: "#ff7eb3",
  gradientB: "#7aa7ff",
  heroScrim: "rgba(20, 12, 28, 0.55)",
  phoneDesktop: "#ebe4f0",
};

type ThemeCtx = {
  mode: ThemeMode;
  colors: AppColors;
  toggle: () => void;
  setMode: (m: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeCtx>({
  mode: "dark",
  colors: dark,
  toggle: () => {},
  setMode: () => {},
});

const KEY = "meetora.theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>("dark");

  useEffect(() => {
    AsyncStorage.getItem(KEY).then((v) => {
      if (v === "light" || v === "dark") setModeState(v);
    });
  }, []);

  const setMode = (m: ThemeMode) => {
    setModeState(m);
    AsyncStorage.setItem(KEY, m);
  };

  const value = useMemo(
    () => ({
      mode,
      colors: mode === "dark" ? dark : light,
      toggle: () => setMode(mode === "dark" ? "light" : "dark"),
      setMode,
    }),
    [mode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}

/** @deprecated prefer useTheme().colors — kept for gradual migration */
export const colors = dark;
export const spacing = { xs: 6, sm: 10, md: 16, lg: 24, xl: 32 };
