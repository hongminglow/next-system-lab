import { cacheLife, cacheTag, unstable_cache } from "next/cache";

export type RandomPayload = {
  value: number;
  generatedAt: string;
};

export const getTaggedRandom = async (): Promise<RandomPayload> => {
  "use cache";
  cacheTag("swr-random");
  cacheLife("hours");

  return {
    value: Math.random(),
    generatedAt: new Date().toISOString(),
  };
};

export const getTimedRandom = unstable_cache(
  async (): Promise<RandomPayload> => {
    return {
      value: Math.random(),
      generatedAt: new Date().toISOString(),
    };
  },
  ["swr-tagged-random-timed:v1"],
  {
    tags: ["swr-random-timed"],
    revalidate: 10,
  },
);
