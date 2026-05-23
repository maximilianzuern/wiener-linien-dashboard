import defaultDemoData from "data/defaultData.json";

import type { ParsedMonitorData } from "~/appTypes/output.types";
import type { WienerLinienResponse } from "~/appTypes/wienerLinien.types";

import { MAX_COUNTDOWN_MINUTES } from "../utils/constants";
import { parseData } from "./parseData";

const WIENER_LINIEN_API_URL = "https://www.wienerlinien.at/ogd_realtime/monitor";

function parseMonitorResponse(data: WienerLinienResponse): ParsedMonitorData {
  if (data.message.value !== "OK" && data.message.messageCode !== 1) {
    throw new Response(`Wiener Linien API Error: ${data.message.value}`, { status: 503 });
  }

  try {
    return parseData(data, MAX_COUNTDOWN_MINUTES);
  } catch (error) {
    throw new Response(
      `Could not parse real-time data. It might be temporarily unavailable: ${error instanceof Error ? error.message : "Unknown error"}`,
      {
        status: 503,
      },
    );
  }
}

export async function fetchMonitorData(stopIDs: string[], signal: AbortSignal) {
  const params = new URLSearchParams(stopIDs.map((id) => ["stopId", id]));
  params.set("activateTrafficInfo", "stoerunglang");

  const response = await fetch(`${WIENER_LINIEN_API_URL}?${params.toString()}`, {
    signal,
    headers: {
      "Accept-Language": "de,en-US;q=0.7,en;q=0.3",
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Wiener Linien API request failed: ${response.status} ${response.statusText}`);
  }

  const data: WienerLinienResponse = await response.json();
  console.info({ event: "wiener_linien.raw_response", rawResponse: data });

  return parseMonitorResponse(data);
}

export async function fetchDefaultDemoData() {
  const data = defaultDemoData as WienerLinienResponse;
  return parseMonitorResponse(data);
}
