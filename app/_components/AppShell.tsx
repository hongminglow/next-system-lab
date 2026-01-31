"use client";

import Link from "next/link";
import * as React from "react";

import { navItems } from "../_lib/nav";
import { IconMenu, IconPanelLeft } from "./icons";
import { ThemeToggle } from "./ThemeToggle";
import { SidebarNav } from "./sidebar/SidebarNav";
import { useSidebar } from "./sidebar/SidebarProvider";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { collapsed, mobileOpen, toggleCollapsed, openMobile, closeMobile } =
    useSidebar();

  return (
    <div
      className="min-h-dvh bg-[var(--background)] text-[var(--foreground)]"
      data-sidebar-collapsed={collapsed ? "true" : "false"}
      data-mobile-open={mobileOpen ? "true" : "false"}
    >
      <header className="sticky top-0 z-40 border-b border-black/10 bg-white/70 backdrop-blur dark:border-white/15 dark:bg-zinc-950/60">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4">
          <button
            type="button"
            onClick={openMobile}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-black/10 bg-white hover:bg-black/3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400/60 md:hidden dark:border-white/15 dark:bg-zinc-950 dark:hover:bg-white/6"
            aria-label="Open navigation"
          >
            <IconMenu className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={toggleCollapsed}
            className="hidden h-9 w-9 items-center justify-center rounded-md border border-black/10 bg-white hover:bg-black/3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400/60 md:inline-flex dark:border-white/15 dark:bg-zinc-950 dark:hover:bg-white/6"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <IconPanelLeft className="h-5 w-5" />
          </button>

          <Link
            href="/"
            className="mr-auto flex items-center gap-2 font-semibold tracking-tight"
          >
            <span className="rounded-md bg-black/6 px-2 py-1 text-sm text-zinc-900 dark:bg-white/10 dark:text-white">
              NSL
            </span>
            <span className="hidden sm:inline">Next System Lab</span>
          </Link>

          <ThemeToggle />
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-7xl">
        {/* Desktop sidebar */}
        <aside className="sticky top-14 hidden h-[calc(100dvh-3.5rem)] w-[--sidebar-current-width)] shrink-0 border-r border-black/10 bg-white/60 backdrop-blur md:block dark:border-white/15 dark:bg-zinc-950/40">
          <SidebarNav items={navItems} />
        </aside>

        {/* Mobile drawer */}
        <div className={mobileOpen ? "md:hidden" : "hidden"}>
          <div
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
            onClick={closeMobile}
            aria-hidden="true"
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-[min(18rem,90vw)] border-r border-black/10 bg-white dark:border-white/15 dark:bg-zinc-950">
            <div className="flex h-14 items-center justify-between border-b border-black/10 px-4 dark:border-white/15">
              <div className="font-semibold">Navigation</div>
              <button
                type="button"
                onClick={closeMobile}
                className="rounded-md px-2 py-1 text-sm text-zinc-600 hover:bg-black/4 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-white/6 dark:hover:text-white"
              >
                Close
              </button>
            </div>
            <SidebarNav items={navItems} />
          </aside>
        </div>

        <main className="min-w-0 flex-1 px-4 py-6 md:px-8">{children}</main>
      </div>
    </div>
  );
}
