import Link from "next/link";

const cases = [
  { href: "/build/a-static-basic", label: "A) static basic" },
  { href: "/build/b-static-with-client", label: "B) static + client" },
  {
    href: "/build/c-static-fetch-default",
    label: "C) static + fetch(default)",
  },
  {
    href: "/build/d-dynamic-fetch-no-store",
    label: "D) dynamic fetch(no-store)",
  },
  { href: "/build/e-force-dynamic", label: "E) export dynamic=force-dynamic" },
  {
    href: "/build/f-force-static-with-client",
    label: "F) export dynamic=force-static (+client)",
  },
  {
    href: "/build/g-suspense-no-store",
    label: "G) Suspense boundary + no-store",
  },
  {
    href: "/build/h-ppr-style-suspense-hole",
    label: "H) PPR-style suspense hole",
  },
  {
    href: "/build/i-ppr-style-cached-chunk",
    label: "I) PPR-style cached chunk",
  },
  {
    href: "/build/z-conflicts",
    label: "Z) Conflicts (toggle lines to explore)",
  },
];

export default function BuildIndex() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          /build – Route build matrix
        </h1>
        <p className="text-sm text-zinc-700 dark:text-zinc-300">
          A collection of routes designed to make `next build` output obvious
          (static vs dynamic vs PPR-style).
        </p>
      </header>

      <section className="rounded-xl border border-black/10 bg-white/70 p-5 text-sm dark:border-white/15 dark:bg-zinc-950/40">
        <div className="font-semibold">How to use</div>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-zinc-700 dark:text-zinc-300">
          <li>
            Run `npm run build` and watch the route summary for each /build/*
            case.
          </li>
          <li>
            Open the case route in prod (`npm run start`) and refresh a few
            times.
          </li>
          <li>
            Read the detailed guide in{" "}
            <Link className="underline" href="/build/guide">
              /build/guide
            </Link>
            .
          </li>
        </ul>
      </section>

      <section className="flex flex-col gap-2">
        {cases.map((c) => (
          <a
            key={c.href}
            href={c.href}
            className="cursor-pointer rounded-lg border border-black/10 bg-white/60 px-4 py-3 text-sm hover:bg-black/3 dark:border-white/15 dark:bg-zinc-950/30 dark:hover:bg-white/6"
          >
            {c.label}
          </a>
        ))}
      </section>
    </div>
  );
}
