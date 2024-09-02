import { API_BASE_URL } from "@/constants";
import type { FetchResult } from "@/types";

// to get the stopID -> https://till.mabe.at/rbl/
export async function fetchData(stopIDs: number[]): Promise<FetchResult> {
  const query = new URLSearchParams(stopIDs.map((id) => ["stopID", id.toString()])).toString();
  try {
    const res = await fetch(`${API_BASE_URL}?${query}`);
    return await res.json();
  } catch (error) {
    return { error: error instanceof Error ? error.message : "An unknown error occurred." };
  }
}
