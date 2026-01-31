"use client";

import { ThemeProvider } from "next-themes";
import * as React from "react";

import { SidebarProvider } from "./_components/sidebar/SidebarProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SidebarProvider>{children}</SidebarProvider>
    </ThemeProvider>
  );
}
