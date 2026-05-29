import { createContext, useEffect, useMemo, useState } from "react";

export const themes = ["graphite", "paper", "phosphor"] as const;
export type Theme = (typeof themes)[number];

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

export const ThemeContext = createContext<ThemeContextValue | null>(null);

function isTheme(value: string | null | undefined): value is Theme {
  return !!value && themes.includes(value as Theme);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof document === "undefined") {
      return "graphite";
    }

    const current = document.documentElement.dataset.theme;
    return isTheme(current) ? current : "graphite";
  });

  const setTheme = (nextTheme: Theme) => {
    setThemeState(nextTheme);
  };

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (isTheme(saved)) {
      setThemeState(saved);
    }
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme === "paper" ? "light" : "dark";
    localStorage.setItem("theme", theme);
  }, [theme]);

  const value = useMemo(() => ({ theme, setTheme }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
