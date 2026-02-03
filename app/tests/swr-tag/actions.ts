"use server";

import { revalidateTag, updateTag } from "next/cache";

export async function revalidateRandomTag() {
	revalidateTag("swr-random", "max");
}

export async function revalidateTimedRandomTag() {
	revalidateTag("swr-random-timed", "max");
}

export async function updateRandomTag() {
	updateTag("swr-random");
}

export async function updateTimedRandomTag() {
	updateTag("swr-random-timed");
}
