"use client";

import { useTheme } from "next-themes";
import * as React from "react";

import { IconLaptop, IconMoon, IconSun } from "./icons";

type ThemeOption = "light" | "dark" | "system";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const current = (theme ?? "system") as ThemeOption;

  return (
    <div className="inline-flex items-center gap-1 rounded-lg border border-black/10 bg-white/70 p-1 text-xs backdrop-blur dark:border-white/15 dark:bg-zinc-950/60">
      <ToggleButton
        active={current === "light"}
        onClick={() => setTheme("light")}
        label="Light"
        icon={<IconSun className="h-4 w-4" />}
      />
      <ToggleButton
        active={current === "dark"}
        onClick={() => setTheme("dark")}
        label="Dark"
        icon={<IconMoon className="h-4 w-4" />}
      />
      <ToggleButton
        active={current === "system"}
        onClick={() => setTheme("system")}
        label="System"
        icon={<IconLaptop className="h-4 w-4" />}
      />
    </div>
  );
}

function ToggleButton({
  active,
  onClick,
  label,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "inline-flex items-center gap-2 rounded-md px-2 py-1 transition-colors duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400/60",
        active
          ? "bg-black/6 text-zinc-900 dark:bg-white/10 dark:text-zinc-100"
          : "text-zinc-600 hover:bg-black/4 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-white/6 dark:hover:text-white",
      ].join(" ")}
    >
      <span className="text-zinc-700 dark:text-zinc-200">{icon}</span>
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
