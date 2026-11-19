// components/shared/ThemeToggle.tsx
"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "@gravity-ui/icons";
import { useTheme } from "next-themes";

const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="h-6 w-10" />; // SSR placeholder

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        isDark ? "bg-cyan-500" : "bg-blue-500"
      }`}
    >
      <span
        className={`inline-flex h-5 w-5 items-center justify-center rounded-full bg-white shadow transition-transform ${
          isDark ? "translate-x-5" : "translate-x-0.5"
        }`}
      >
        {isDark ? (
          <Sun className="size-3.5 text-cyan-600" />
        ) : (
          <Moon className="size-3.5 text-blue-600" />
        )}
      </span>
    </button>
  );
};

export default ThemeToggle;





