"use client";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  revalidateRandomTag,
  revalidateTimedRandomTag,
  updateRandomTag,
  updateTimedRandomTag,
} from "../actions";

export function TagButtons() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        className="rounded-md border border-black/10 bg-white px-3 py-1.5 text-sm dark:border-white/15 dark:bg-zinc-950/40"
        onClick={() => {
          startTransition(async () => {
            await revalidateRandomTag();
            // router.refresh();
          });
        }}
        disabled={isPending}
      >
        Invalidate tag: swr-random
      </button>

      <button
        type="button"
        className="rounded-md border border-black/10 bg-white px-3 py-1.5 text-sm dark:border-white/15 dark:bg-zinc-950/40"
        onClick={() => {
          startTransition(async () => {
            await updateRandomTag();
            // router.refresh();
          });
        }}
        disabled={isPending}
      >
        Update tag: swr-random
      </button>

      <button
        type="button"
        className="rounded-md border border-black/10 bg-white px-3 py-1.5 text-sm dark:border-white/15 dark:bg-zinc-950/40"
        onClick={() => {
          startTransition(async () => {
            await revalidateTimedRandomTag();
            // router.refresh();
          });
        }}
        disabled={isPending}
      >
        Invalidate tag: swr-random-timed
      </button>

      <button
        type="button"
        className="rounded-md border border-black/10 bg-white px-3 py-1.5 text-sm dark:border-white/15 dark:bg-zinc-950/40"
        onClick={() => {
          startTransition(async () => {
            await updateTimedRandomTag();
            // router.refresh();
          });
        }}
        disabled={isPending}
      >
        Update tag: swr-random-timed
      </button>

      <button
        type="button"
        className="rounded-md border border-black/10 px-3 py-1.5 text-sm dark:border-white/15"
        onClick={() => router.refresh()}
        disabled={isPending}
      >
        router.refresh()
      </button>

      <span className="text-xs text-zinc-500 dark:text-zinc-400">
        {isPending ? "Working…" : ""}
      </span>
    </div>
  );
}
