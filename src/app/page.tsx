"use client";
import { useEffect, useState } from "react";
import type { Welcome, OutputData } from "./types";
import { useSearchParams } from "next/navigation";

const DEFAULT_STOP_IDS = [4111, 4118];
const API_BASE_URL = "/api/monitor";
const MAX_COUNTDOWN = 40;
const MAX_DISPLAYED_COUNTDOWNS = 6;
const AIRCONDITIONED_METROS = ["U6"];
const TRANSPORT_EMOJI_LOOKUP: Record<string, string> = {
  ptTram: "🚃",
  ptTramWLB: "🚃",
  ptBusCity: "🚌",
  ptBusNight: "🚌",
  ptMetro: "🚇",
  ptTrainS: "🚆",
};

// to get the stopID -> https://till.mabe.at/rbl/
async function fetchData(stopIDs: number[] = [], invalidKey: boolean): Promise<Welcome | { error: string }> {
  const validStopIDs = stopIDs.length > 0 ? stopIDs : DEFAULT_STOP_IDS;
  const query = new URLSearchParams(validStopIDs.map((id) => ["stopID", id.toString()])).toString();
  if (invalidKey) {
    return {error: "Invalid stopID key in URL."};
  }
  
  try {
    const res = await fetch(`${API_BASE_URL}?${query}`);
    if (!res.ok) {
      throw new Error(`Wiener Linien API request failed with status ${res.status}`);
    }

    const data: Welcome = await res.json();

    if (data.data?.monitors.length === 0 && data.message.value === "OK") {
      return {
        error: "No departures found for the given stopID.",
      };
    } else if (data.message.value !== "OK") {
      return {
        error: `API response: ${data.message.value}`,
      };
    }

    return data;
  } catch (error) {
    return {
      error: error instanceof Error ? `Error: ${error.message}` : "An unknown error occurred.",
    };
  }
}

function parseData(data: Welcome): Record<string, OutputData[]> {
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

export default function Home() {
  const [error, setError] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<Record<string, OutputData[]>>();

  const searchParams = useSearchParams();
  // validate the searchParams
  const keys = Array.from(searchParams.keys());
  const invalidKey = keys.some((key) => key.toLowerCase() !== "stopid");

  const query = Array.from(searchParams.values()).map(Number);

  useEffect(() => {
    fetchData(query, invalidKey).then((result) => {
      if ("error" in result) {
        setError(result.error);
      } else {
        try {
          setParsedData(parseData(result));
        } catch (e) {
          setError("Real time data not available. 😓🚨");
        }
      }
    });
  }, []);

  if (invalidKey) {
    return (
      <div className="container mx-auto p-2">
        <h1 className="text-xl font-bold text-center mb-2">Vienna Public Transport</h1>
        <div className="text-center text-red-500 font-semibold my-10">
          Error in URL: {searchParams.toString()}
        </div>
        <div className="text-center text-red-500 font-semibold my-10">
          Please provide a valid stopID.
        </div>
        <Footer />
      </div>
    );
  }

  const noParamsMessage =
    query.length === 0 ? (
      <div
        className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4"
        role="alert"
      >
        <p className="font-bold">Using default stops</p>
        <p>To see departures for specific stops:</p>
        <ol className="list-decimal list-inside mt-1">
          <li>
            Find valid stop IDs{" "}
            <a
              href="https://till.mabe.at/rbl/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              here
            </a>
          </li>
          <li>
            Add to the web address:{" "}
            <span className="font-mono bg-yellow-200 px-1">/?stopID=123</span>
          </li>
          <li>
            For multiple stops, use:{" "}
            <span className="font-mono bg-yellow-200 px-1">/?stopID=123&amp;stopID=456</span>
          </li>
        </ol>
      </div>
    ) : null;

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
      {noParamsMessage}
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
      <div className="font-bold">
        {line.name} {TRANSPORT_EMOJI_LOOKUP[line.type as keyof typeof TRANSPORT_EMOJI_LOOKUP] ?? ""}
      </div>
      <div className="text-gray-500">
        {line.towards.includes(" ")
          ? line.towards.charAt(0) +
            line.towards.slice(1).toLowerCase().split(" ")[0] +
            line.towards.slice(line.towards.indexOf(" "))
          : line.towards.charAt(0).toUpperCase() + line.towards.slice(1).toLowerCase()}
      </div>
    </div>
    <div className="ml-3 mt-5">
      {line.countdowns?.slice(0, MAX_DISPLAYED_COUNTDOWNS).map((countdown, i) => (
        <CountdownBadge
          key={i}
          countdown={countdown}
          hasAircon={line.aircon && (AIRCONDITIONED_METROS.includes(line.name) || line.aircon[i])}
          type={line.type}
          timePlanned={line.timePlanned && line.timePlanned[i]}
          timeReal={line.timeReal && line.timeReal[i]}
        />
      ))}
    </div>
  </div>
);

const CountdownBadge = ({
  countdown,
  timePlanned,
  timeReal,
  type,
  hasAircon,
}: {
  countdown: number;
  timePlanned?: string;
  timeReal?: string;
  type?: string;
  hasAircon?: boolean;
}) => {
  const [showPopover, setShowPopover] = useState(false);

  const togglePopover = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent triggering the document's click event
    setShowPopover((previous) => !previous);
  };

  useEffect(() => {
    const handleClickOutside = () => setShowPopover(false);

    if (showPopover) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [showPopover]);
  const popoverContent =
    timeReal && timeReal !== "Invalid" ? timeReal : `Planned: ${timePlanned ?? ""}`;

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
      {showPopover && popoverContent && (
        <div
          className="absolute z-10 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2"
          role="tooltip"
        >
          {popoverContent}
          <div className="absolute w-2 h-2 bg-gray-900 transform rotate-45 -bottom-1 left-1/2 -translate-x-1/2"></div>
        </div>
      )}
      {type === "ptMetro" &&
        hasAircon !== undefined &&
        (hasAircon ? (
          <span className="absolute -top-2 -right-1 text-xs" title="❄️ A/C available">
            ❄️
          </span>
        ) : (
          <span className="absolute -top-2 -right-1 text-xs" title="🔥 Hot">
            🥵
          </span>
        ))}
    </span>
  );
};

const Footer = () => (
  <div className="my-10 text-center text-sm text-gray-400">
    Find valid stopIDs{" "}
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
    e.g &apos;/?stopID=123&amp;stopID=124&apos; to specify stopIDs.
    <br />
    🍪 This website is cookie-free.
  </div>
);
