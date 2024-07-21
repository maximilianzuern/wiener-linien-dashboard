"use client";
import { useEffect, useState } from "react";
import type { Welcome, OutputData } from "./types";
import { useSearchParams } from "next/navigation";

const DEFAULT_STOP_IDS = [4111, 4118];
const API_BASE_URL = "/api/proxy";
const MAX_COUNTDOWN = 30;
const MAX_DISPLAYED_COUNTDOWNS = 6;
const AIRCONDITIONED_METROS = ["U6"];

// to get the stopID -> https://till.mabe.at/rbl/
async function fetchData(stopIDs: number[] = []): Promise<Welcome | { error: string }> {
  const validStopIDs =
    stopIDs.length > 0 && stopIDs.every((id) => !isNaN(id)) ? stopIDs : DEFAULT_STOP_IDS;
  const query = new URLSearchParams(validStopIDs.map((id) => ["stopID", id.toString()])).toString();

  try {
    const res = await fetch(`${API_BASE_URL}?${query}`);
    if (!res.ok) {
      throw new Error(`Wiener Linien API request failed with status ${res.status}`);
    }

    const data: Welcome = await res.json();

    // Check if the monitor has lines
    const monitor = data.data.monitors.find((monitor) => monitor.lines);
    if (!monitor) {
      if (data.message.value === "OK") {
        return { error: "Invalid stopID!" };
      }
      return { error: "No valid monitor found in the API response." };
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      return { error: `Error: ${error.message}` };
    }
    return { error: "An unknown error occurred." };
  }
}

function parseData(data: Welcome): Record<string, OutputData[]> {
  const result: Record<string, OutputData[]> = {};

  data.data.monitors.forEach((monitor) => {
    const title = monitor.locationStop.properties.title;

    monitor.lines.forEach((line) => {
      const { name, towards, departures } = line;
      const countdowns = departures?.departure
        .map((departure) => departure.departureTime.countdown)
        .filter((countdown) => countdown <= MAX_COUNTDOWN);
      const timePlanned = departures?.departure.map((departure) => {
        const date = new Date(departure.departureTime.timePlanned);
        return date.toTimeString().split(" ")[0];
      });
      const aircon =
        departures?.departure.map((dep) => dep.vehicle?.foldingRampType !== undefined) ?? [];

      if (!result[title]) {
        result[title] = [];
      }
      result[title].push({ name, towards, countdowns, timePlanned, aircon });
    });
  });
  return Object.fromEntries(Object.entries(result).sort());
}

export default function Home() {
  const [data, setData] = useState<Welcome | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<Record<string, OutputData[]>>();

  const searchParams = useSearchParams();
  const query = Array.from(searchParams.values()).map(Number);

  useEffect(() => {
    fetchData(query).then((result) => {
      if ('error' in result) {
        setError(result.error);
      } else {
        setData(result);
      }
    });
  }, []);

  useEffect(() => {
    if (data) {
      try {
        setParsedData(parseData(data));
      } catch (e) {
        setError("Real time data not available. 😓🚨");
      }
    }
  }, [data]);

  if (error) {
    return (
      <div className="container mx-auto p-2">
        <h1 className="text-xl font-bold text-center mb-2">Vienna Public Transport</h1>
        <div className="text-center text-red-500 font-semibold my-10">{error}</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-2">
      <h1 className="text-xl font-bold text-center mb-1">Vienna Public Transport</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {parsedData &&
          Object.entries(parsedData).map(([title, lines]) => (
            <StopCard key={title} title={title} lines={lines} />
          ))}
      </div>
      <Footer />
    </div>
  );
}

const StopCard = ({ title, lines }: { title: string; lines: OutputData[] }) => (
  <div className="bg-white shadow-lg rounded-lg p-3">
    <div className="border-b-2 border-gray-200">
      <h3 className="text-xl font-semibold mt-1">{title}</h3>
    </div>
    <div className="mt-4">
      {lines.map((line) => (
        <LineInfo key={line.name} line={line} />
      ))}
    </div>
  </div>
);

const LineInfo = ({ line }: { line: OutputData }) => (
  <div className="mb-1 flex items-center">
    <div>
      <div className="font-bold">{line.name}</div>
      <div className="text-gray-500">{line.towards}</div>
    </div>
    <div className="ml-3 mt-5">
      {line.countdowns?.slice(0, MAX_DISPLAYED_COUNTDOWNS).map((countdown, i) => (
        <CountdownBadge
          key={i}
          countdown={countdown}
          hasAircon={line.aircon && (AIRCONDITIONED_METROS.includes(line.name) || line.aircon[i])}
          timePlanned={line.timePlanned && line.timePlanned[i]}
        />
      ))}
    </div>
  </div>
);

const CountdownBadge = ({
  countdown,
  timePlanned,
  hasAircon,
}: {
  countdown: number;
  timePlanned?: string;
  hasAircon?: boolean;
}) => {
  const [showPopover, setShowPopover] = useState(false);

  const togglePopover = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent triggering the document's click event
    setShowPopover(!showPopover);
  };

  useEffect(() => {
    const handleClickOutside = () => {
      setShowPopover(false);
    };

    if (showPopover) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showPopover]); // Effect runs when `showPopover` changes

  return (
    <span className="relative inline-block mr-2">
      <button
        onClick={togglePopover}
        className={`inline-block text-white rounded-full px-2 py-1 text-xs font-bold
          ${countdown < 4 ? "bg-red-600" : "bg-green-600"} 
          ${countdown < 2 ? "animate-pulse" : ""}
          ${hasAircon ? "border-2 border-blue-600" : ""}
        `}
      >
        {countdown}
      </button>
      {showPopover && timePlanned && (
        <div className="absolute z-10 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2">
          {timePlanned}
          <div className="absolute w-2 h-2 bg-gray-900 transform rotate-45 -bottom-1 left-1/2 -translate-x-1/2"></div>
        </div>
      )}
      {hasAircon && (
        <span className="absolute -top-2 -right-1 text-xs" title="❄️ A/C available">
          ❄️
        </span>
      )}
    </span>
  );
};

const Footer = () => (
  <div className="my-10 text-center text-sm text-gray-400">
    Use URL parameters e.g &apos;/?stopID=123&amp;stopID=124&apos; to specify stop IDs.
    <br />
    Find valid stop IDs{" "}
    <a
      href="https://till.mabe.at/rbl/"
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-400 underline"
    >
      here
    </a>
    .
    <br />
    🍪 This website is cookie-free.
  </div>
);
