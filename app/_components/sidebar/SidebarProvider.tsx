"use client";

import * as React from "react";

type SidebarState = {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  toggleCollapsed: () => void;
  openMobile: () => void;
  closeMobile: () => void;
};

const SidebarContext = React.createContext<SidebarState | null>(null);

const STORAGE_KEY = "nsl.sidebar.collapsed";

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsedState] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw === "true") setCollapsedState(true);
    } catch {
      // ignore
    }
  }, []);

  const setCollapsed = React.useCallback((value: boolean) => {
    setCollapsedState(value);
    try {
      window.localStorage.setItem(STORAGE_KEY, String(value));
    } catch {
      // ignore
    }
  }, []);

  const toggleCollapsed = React.useCallback(() => {
    setCollapsed(!collapsed);
  }, [collapsed, setCollapsed]);

  const openMobile = React.useCallback(() => setMobileOpen(true), []);
  const closeMobile = React.useCallback(() => setMobileOpen(false), []);

  const value: SidebarState = React.useMemo(
    () => ({
      collapsed,
      setCollapsed,
      mobileOpen,
      setMobileOpen,
      toggleCollapsed,
      openMobile,
      closeMobile,
    }),
    [
      collapsed,
      setCollapsed,
      mobileOpen,
      toggleCollapsed,
      openMobile,
      closeMobile,
    ],
  );

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
}

export function useSidebar() {
  const ctx = React.useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used within <SidebarProvider>");
  return ctx;
}
