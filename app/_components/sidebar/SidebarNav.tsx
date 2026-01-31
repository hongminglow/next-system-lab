"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";

import type { NavItem } from "../../_lib/nav";
import { useSidebar } from "./SidebarProvider";

export function SidebarNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  const { collapsed, closeMobile } = useSidebar();

  return (
    <nav className="flex flex-col gap-6 px-3 py-4">
      {items.map((item) => (
        <section key={item.href} className="flex flex-col gap-1">
          <NavLink
            href={item.href}
            label={item.label}
            active={isActive(pathname, item)}
            collapsed={collapsed}
            onNavigate={closeMobile}
            variant="section"
          />

          {item.children?.length ? (
            <div className="mt-1 flex flex-col gap-1">
              {item.children.map((child) => (
                <NavLink
                  key={child.href}
                  href={child.href}
                  label={child.label}
                  active={isActive(pathname, child)}
                  collapsed={collapsed}
                  onNavigate={closeMobile}
                  variant="child"
                />
              ))}
            </div>
          ) : null}
        </section>
      ))}
    </nav>
  );
}

function NavLink({
  href,
  label,
  active,
  collapsed,
  onNavigate,
  variant,
}: {
  href: `/${string}`;
  label: string;
  active: boolean;
  collapsed: boolean;
  onNavigate: () => void;
  variant: "section" | "child";
}) {
  return (
    <Link
      href={href as Route}
      onClick={onNavigate}
      className={[
        "group inline-flex items-center justify-between gap-2 rounded-md px-3 py-2 text-sm transition-colors duration-200",
        collapsed ? "justify-center" : "",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400/60",
        variant === "child" ? "pl-5 text-[13px]" : "font-medium",
        active
          ? "bg-black/6 text-zinc-950 dark:bg-white/10 dark:text-white"
          : "text-zinc-600 hover:bg-black/4 hover:text-zinc-950 dark:text-zinc-300 dark:hover:bg-white/6 dark:hover:text-white",
      ].join(" ")}
      title={collapsed ? label : undefined}
    >
      {collapsed ? (
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-black/4 text-[10px] font-semibold text-zinc-700 dark:bg-white/8 dark:text-zinc-200">
          {label
            .split(" ")
            .map((w) => w[0])
            .join("")
            .slice(0, 2)
            .toUpperCase()}
        </span>
      ) : (
        <span className="truncate">{label}</span>
      )}
    </Link>
  );
}

function isActive(pathname: string, item: NavItem) {
  if (item.match === "exact") return pathname === item.href;
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}
