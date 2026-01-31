export type NavItem = {
  label: string;
  href: `/${string}`;
  match?: "exact" | "prefix";
  children?: NavItem[];
};

export const navItems: NavItem[] = [
  {
    label: "Home",
    href: "/",
    match: "exact",
  },
  {
    label: "Top-level",
    href: "/ssg",
    match: "prefix",
    children: [
      { label: "SSG", href: "/ssg", match: "exact" },
      { label: "SSR", href: "/ssr", match: "exact" },
    ],
  },
  {
    label: "Experiments",
    href: "/tests",
    match: "prefix",
    children: [
      { label: "Index", href: "/tests", match: "exact" },
      { label: "Rendering", href: "/tests/rendering", match: "prefix" },
      { label: "use cache", href: "/tests/use-cache", match: "prefix" },
      {
        label: "cache vs force-cache",
        href: "/tests/cache-vs-force-cache",
        match: "prefix",
      },
      { label: "CMS (SSR/ISR/PPR-style)", href: "/tests/cms", match: "prefix" },
    ],
  },
  {
    label: "Build Matrix",
    href: "/build",
    match: "prefix",
    children: [
      { label: "Index", href: "/build", match: "exact" },
      {
        label: "A) static basic",
        href: "/build/a-static-basic",
        match: "exact",
      },
      {
        label: "B) static + client",
        href: "/build/b-static-with-client",
        match: "exact",
      },
      {
        label: "C) static + fetch(default)",
        href: "/build/c-static-fetch-default",
        match: "exact",
      },
      {
        label: "D) dynamic fetch(no-store)",
        href: "/build/d-dynamic-fetch-no-store",
        match: "exact",
      },
      {
        label: "E) force-dynamic",
        href: "/build/e-force-dynamic",
        match: "exact",
      },
      {
        label: "F) force-static + client",
        href: "/build/f-force-static-with-client",
        match: "exact",
      },
      {
        label: "G) suspense + no-store",
        href: "/build/g-suspense-no-store",
        match: "exact",
      },
      {
        label: "H) PPR-style (suspense hole)",
        href: "/build/h-ppr-style-suspense-hole",
        match: "exact",
      },
      {
        label: "I) PPR-style (cached chunk)",
        href: "/build/i-ppr-style-cached-chunk",
        match: "exact",
      },
      {
        label: "Z) conflicts (toggle)",
        href: "/build/z-conflicts",
        match: "exact",
      },
    ],
  },
  {
    label: "API: time",
    href: "/api/time",
    match: "exact",
  },
];
