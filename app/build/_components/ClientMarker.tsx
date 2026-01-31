"use client";

import * as React from "react";

export function ClientMarker({ label }: { label: string }) {
  const [mountedAt, setMountedAt] = React.useState<string>("(not mounted yet)");

  React.useEffect(() => {
    setMountedAt(new Date().toISOString());
  }, []);

  return (
    <section className="rounded-lg border border-black/10 bg-white/70 p-4 text-sm dark:border-white/15 dark:bg-zinc-950/40">
      <div className="font-semibold">Client component marker</div>
      <div className="mt-2 text-zinc-700 dark:text-zinc-300">
        <div>
          <span className="font-medium">label:</span> {label}
        </div>
        <div>
          <span className="font-medium">mountedAt:</span> {mountedAt}
        </div>
        <div className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
          Tip: open DevTools Console + refresh.
        </div>
      </div>
    </section>
  );
}
