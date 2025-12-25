"use client";

import { MoonIcon, SunIcon } from "@heroicons/react/16/solid";
import { useEffect, useState } from "react";

type Theme = "light" | "dark";

export default function ThemeSetter() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme | null;

    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    } else {
      // No saved preference → follow system
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;

      const systemTheme: Theme = prefersDark ? "dark" : "light";
      setTheme(systemTheme);
    }
  }, []);

  const toggleTheme = () => {
    if (!theme) return;

    const nextTheme: Theme = theme === "dark" ? "light" : "dark";

    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("theme", nextTheme);
  };

  if (!theme) return null;

  return (
    <div className="theme-wrapper">
      {theme === "light" ? <SunIcon /> : <MoonIcon />}
      <button
        onClick={toggleTheme}
        aria-label="Toggle dark mode"
        className="theme-btn transition-colors duration-200"
      >
        <span className="theme-toggle transform transition-transform duration-200" />
      </button>
    </div>
  );
}
