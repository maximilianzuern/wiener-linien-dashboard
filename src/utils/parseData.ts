import type { Welcome, OutputData } from "@/types";

export function parseData(data: Welcome, MAX_COUNTDOWN: number): Record<string, OutputData[]> {
  const result: Record<string, OutputData[]> = {};

  data.data.monitors.forEach((monitor) => {
    const title = monitor.locationStop.properties.title;

    monitor.lines.forEach((line) => {
      const { name, towards, type, departures } = line;
      const countdowns =
        departures?.departure
          .map((departure) => departure.departureTime.countdown)
          .filter((countdown) => countdown <= MAX_COUNTDOWN) ?? [];
      const timeReal =
        departures?.departure.map((departure) => {
          const date = new Date(departure.departureTime?.timeReal ?? "");
          return date.toTimeString().split(" ")[0];
        }) ?? [];
      const timePlanned = departures?.departure.map((departure) => {
        const date = new Date(departure.departureTime.timePlanned);
        return date.toTimeString().split(" ")[0];
      });
      const aircon =
        departures?.departure.map((dep, index) =>
          index < 2 ? dep.vehicle?.foldingRampType !== undefined : undefined
        ) ?? [];

      if (!result[title]) {
        result[title] = [];
      }
      result[title].push({ name, towards, type, countdowns, timeReal, timePlanned, aircon });
    });
  });
  return Object.fromEntries(Object.entries(result).sort());
}
