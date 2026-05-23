import type {
  ParsedDeparture,
  ParsedDisruption,
  ParsedLine,
  ParsedMonitorData,
  ParsedStop,
} from "~/appTypes/output.types";
import type { WienerLinienResponse } from "~/appTypes/wienerLinien.types";

const VIENNA_TIME_WITH_SECONDS_OPTIONS: Intl.DateTimeFormatOptions = {
  timeZone: "Europe/Vienna",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
};

const VIENNA_TIME_OPTIONS: Intl.DateTimeFormatOptions = {
  timeZone: "Europe/Vienna",
  hour: "2-digit",
  minute: "2-digit",
};

function formatViennaTime(value?: string, includeSec = false): string | undefined {
  if (!value) return undefined;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  const formatOptions = includeSec ? VIENNA_TIME_WITH_SECONDS_OPTIONS : VIENNA_TIME_OPTIONS;
  return date.toLocaleTimeString("de-AT", formatOptions);
}

type DisruptionMatch = {
  relatedLines: string[];
  disruption: ParsedDisruption;
};

function getDisruptionsByStopId(data: WienerLinienResponse): Map<number, DisruptionMatch[]> {
  const disruptionsByStopId = new Map<number, DisruptionMatch[]>();

  for (const trafficInfo of data.data.trafficInfos ?? []) {
    const relatedStops = trafficInfo.relatedStops ?? [];
    if (relatedStops.length === 0) continue;

    const disruption: ParsedDisruption = {
      title: trafficInfo.title,
      description: trafficInfo.description,
      status: trafficInfo.status,
      created: formatViennaTime(trafficInfo.time.created),
      start: formatViennaTime(trafficInfo.time.start),
      resume: formatViennaTime(trafficInfo.time.resume),
      lastUpdate: formatViennaTime(trafficInfo.time.lastUpdate),
    };

    for (const stopId of relatedStops) {
      const currentDisruptions = disruptionsByStopId.get(stopId) ?? [];
      currentDisruptions.push({
        relatedLines: trafficInfo.relatedLines ?? [],
        disruption,
      });
      disruptionsByStopId.set(stopId, currentDisruptions);
    }
  }

  return disruptionsByStopId;
}

export function parseData(data: WienerLinienResponse, maxCountdown: number): ParsedMonitorData {
  // Group by stop title, because one station can have multiple IDs
  const stopsByTitle = new Map<string, ParsedStop>();
  // Set of all IDs that actually came back from the API
  const returnedStopIds = new Set<number>();
  const disruptionsByStopId = getDisruptionsByStopId(data);

  for (const monitor of data.data.monitors) {
    const title = monitor.locationStop.properties.title;
    const stopId = monitor.locationStop.properties.attributes.rbl;

    returnedStopIds.add(stopId);

    let stop = stopsByTitle.get(title);

    if (!stop) {
      stop = {
        title,
        stopIds: [stopId],
        lines: [],
      };
      stopsByTitle.set(title, stop);
    }

    if (!stop.stopIds.includes(stopId)) {
      stop.stopIds.push(stopId);
    }

    // Parse lines and departures
    for (const line of monitor.lines) {
      const departures: ParsedDeparture[] = line.departures.departure
        .filter((departure) => departure.departureTime.countdown <= maxCountdown)
        .map((departure) => ({
          countdown: departure.departureTime.countdown,
          timeReal: formatViennaTime(departure.departureTime.timeReal, true),
          timePlanned: formatViennaTime(departure.departureTime.timePlanned, true),
          aircon: departure.vehicle?.foldingRamp,
        }));

      // Skip lines without any relevant departures
      if (departures.length === 0) continue;

      // Match by stop and line name so disruptions stay scoped to the correct service.
      const disruptions = (disruptionsByStopId.get(stopId) ?? [])
        .filter(({ relatedLines }) => relatedLines.length === 0 || relatedLines.includes(line.name))
        .map(({ disruption }) => disruption);

      const parsedLine: ParsedLine = {
        name: line.name,
        towards: line.towards,
        type: line.type,
        departures,
        disruptions,
      };

      stop.lines.push(parsedLine);
    }
  }

  const stops = [...stopsByTitle.values()]
    // Hide empty stations after countdown filtering.
    .filter((stop) => stop.lines.length > 0)
    .sort((a, b) => a.title.localeCompare(b.title, "de"))
    .map((stop) => ({
      ...stop,
      stopIds: [...stop.stopIds].sort((a, b) => a - b),
    }));

  return {
    serverTime: data.message.serverTime,
    returnedStopIds: [...returnedStopIds].sort((a, b) => a - b),
    stops,
  };
}
