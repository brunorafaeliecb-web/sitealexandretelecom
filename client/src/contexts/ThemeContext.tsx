import React, { createContext, useContext, useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme?: () => void;
  switchable: boolean;
  darkMode: boolean;
  toggleDarkMode: () => void;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  darkBackgroundColor: string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  switchable?: boolean;
}

export function ThemeProvider({
  children,
  defaultTheme = "light",
  switchable = false,
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (switchable) {
      const stored = localStorage.getItem("theme");
      return (stored as Theme) || defaultTheme;
    }
    return defaultTheme;
  });

  const [darkMode, setDarkMode] = useState(false);
  const [primaryColor, setPrimaryColor] = useState("#00D4E8");
  const [secondaryColor, setSecondaryColor] = useState("#A855F7");
  const [backgroundColor, setBackgroundColor] = useState("#FAF8F5");
  const [darkBackgroundColor, setDarkBackgroundColor] = useState("#0D1526");

  // Fetch theme settings from server
  const { data: themeSettings } = trpc.admin.getThemeSettings.useQuery();

  // Load dark mode preference from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode !== null) {
      setDarkMode(JSON.parse(savedDarkMode));
    }
  }, []);

  // Update theme settings when fetched
  useEffect(() => {
    if (themeSettings) {
      setPrimaryColor(themeSettings.primaryColor);
      setSecondaryColor(themeSettings.secondaryColor);
      setBackgroundColor(themeSettings.backgroundColor);
      setDarkBackgroundColor(themeSettings.darkBackgroundColor);
      setDarkMode(themeSettings.darkModeEnabled);
    }
  }, [themeSettings]);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;

    // Apply light/dark theme class
    if (theme === "dark" || darkMode) {
      root.classList.add("dark");
      root.style.backgroundColor = darkBackgroundColor;
      root.style.color = "#E5E7EB";
    } else {
      root.classList.remove("dark");
      root.style.backgroundColor = backgroundColor;
      root.style.color = "#1F2937";
    }

    // Set CSS variables
    root.style.setProperty("--primary-color", primaryColor);
    root.style.setProperty("--secondary-color", secondaryColor);
  }, [theme, darkMode, primaryColor, secondaryColor, backgroundColor, darkBackgroundColor]);

  const toggleTheme = switchable
    ? () => {
        setTheme(prev => (prev === "light" ? "dark" : "light"));
      }
    : undefined;

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", JSON.stringify(newDarkMode));
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        switchable,
        darkMode,
        toggleDarkMode,
        primaryColor,
        secondaryColor,
        backgroundColor,
        darkBackgroundColor,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
