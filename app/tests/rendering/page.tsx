import Link from "next/link";

export default function RenderingIndex() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-6 px-6 py-10">
      <h1 className="text-xl font-semibold tracking-tight">
        A) Server vs Client rendering
      </h1>
      <p className="text-sm text-zinc-700 dark:text-zinc-300">
        Compare static vs dynamic route, then watch:
        <br />
        - Terminal logs (Server Components)
        <br />- Browser console logs (Client hydration)
      </p>

      <div className="flex gap-3">
        <Link prefetch className="underline" href="/tests/rendering/ssg">
          /tests/rendering/ssg
        </Link>
        <Link prefetch className="underline" href="/tests/rendering/ssr">
          /tests/rendering/ssr
        </Link>
      </div>

      <a className="text-sm underline" href="/tests">
        Back
      </a>
    </main>
  );
}
