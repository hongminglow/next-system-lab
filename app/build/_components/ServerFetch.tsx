type FetchMode = "default" | "force-cache" | "no-store";

const TIME_API = "https://worldtimeapi.org/api/timezone/Etc/UTC";

export async function ServerFetch({
  label,
  mode,
}: {
  label: string;
  mode: FetchMode;
}) {
  const init: RequestInit | undefined =
    mode === "default"
      ? undefined
      : mode === "force-cache"
        ? { cache: "force-cache" }
        : { cache: "no-store" };

  const result = await safeFetchJson(TIME_API, init);
  const startedAt = new Date().toISOString();

  return (
    <section className="rounded-lg border border-black/10 bg-white/70 p-4 text-sm dark:border-white/15 dark:bg-zinc-950/40">
      <div className="font-semibold">Server fetch</div>
      <div className="mt-2 text-zinc-700 dark:text-zinc-300">
        <div>
          <span className="font-medium">label:</span> {label}
        </div>
        <div>
          <span className="font-medium">mode:</span> {mode}
        </div>
        <div>
          <span className="font-medium">startedAt:</span> {startedAt}
        </div>
        <div className="mt-3 rounded-md border border-black/10 bg-white/60 p-3 text-xs dark:border-white/15 dark:bg-zinc-950/60">
          <pre className="whitespace-pre-wrap break-words">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      </div>
    </section>
  );
}

async function safeFetchJson(url: string, init?: RequestInit) {
  try {
    const res = await fetch(url, init);
    const text = await res.text();
    return {
      ok: res.ok,
      status: res.status,
      cache: init?.cache ?? "(default)",
      url,
      body: safeJsonParse(text),
    };
  } catch (err) {
    return {
      ok: false,
      status: 0,
      cache: init?.cache ?? "(default)",
      url,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

function safeJsonParse(input: string): unknown {
  try {
    return JSON.parse(input);
  } catch {
    return input;
  }
}
