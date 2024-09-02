"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { OutputData } from "./types";

const DEFAULT_STOP_IDS: number[] = [4111, 4118];
const API_BASE_URL: string = "/api/monitor";
const MAX_DISPLAYED_COUNTDOWNS: number = 6;
const AIRCONDITIONED_METROS: string[] = ["U6"];
const TRANSPORT_EMOJI_LOOKUP: Record<string, string> = {
  ptTram: "🚃",
  ptTramWLB: "🚃",
  ptBusCity: "🚌",
  ptBusNight: "🚌",
  ptMetro: "🚇",
  ptTrainS: "🚆",
};

type FetchResult = Record<string, OutputData[]> | { error: string };

// to get the stopID -> https://till.mabe.at/rbl/
async function fetchData(stopIDs: number[] = [], invalidKey: boolean): Promise<FetchResult> {
// async function fetchData(stopIDs: number[]): Promise<FetchResult> {
  const query = new URLSearchParams(stopIDs.map(id => ["stopID", id.toString()])).toString();
  if (invalidKey) {
    return {error: "Invalid stopID key in URL."};
  }
  
  try {
    const res = await fetch(`${API_BASE_URL}?${query}`);
    return await res.json();
  } catch (error) {
    return { error: error instanceof Error ? error.message : "An unknown error occurred." };
  }
}

export default function Home() {
  const [fetchedError, setError] = useState<string | OutputData[] | null>(null);
  const [data, setData] = useState<FetchResult | null>(null);

  const searchParams = useSearchParams();
  const getStopIDs = useCallback(() => {
    const params = searchParams.getAll("stopID");
    return params.length > 0 ? params.map(Number) : DEFAULT_STOP_IDS;
  }, [searchParams]);

  // validate the searchParams
  // const keys = Array.from(searchParams.keys());
  // const invalidKey = keys.some((key) => key.toLowerCase() !== "stopid");
  const invalidKey = Array.from(searchParams.keys()).some(key => key.toLowerCase() !== "stopid");
  const query = Array.from(searchParams.values()).map(Number);

  useEffect(() => {
    const stopIDs = getStopIDs();
    fetchData(stopIDs, invalidKey).then((result) => {
      if (result.error) {
        setError(result.error);
      } else {
        setData(result);
      }
    });
  }, []);

  // useEffect(() => {
  //   if (!invalidKey) {
  //     fetchData(getStopIDs()).then(setData);
  //   }
  // }, [getStopIDs, invalidKey]);

  if (invalidKey) {
  return <ErrorMessage message="Invalid stopID key in URL." />;
  }

  if (fetchedError) {
    return <ErrorMessage message={fetchedError.toString()} />;
  }

  return (
    <div className="container mx-auto p-2">
      <h1 className="text-xl font-bold text-center mb-1">Vienna Public Transport</h1>
      {query.length === 0 && <DefaultStopsMessage />}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {data &&
          Object.entries(data).map(([title, lines]) => (
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
          {formatTowards(line.towards)}
      </div>
    </div>
    <div className="ml-3 mt-5">
      {line.countdowns?.slice(0, MAX_DISPLAYED_COUNTDOWNS).map((countdown, i) => (
        <CountdownBadge
          key={i}
          countdown={countdown}
          hasAircon={line.aircon && (AIRCONDITIONED_METROS.includes(line.name) || line.aircon[i])}
          type={line.type}
          timePlanned={line.timePlanned?.[i]}
          timeReal={line.timeReal?.[i]}
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

  useEffect(() => {
    if (showPopover) {
      const handleClickOutside = () => setShowPopover(false);
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [showPopover]);

  return (
    <span className="relative inline-block mr-2">
      <button
        onClick={(e) => { e.stopPropagation(); setShowPopover(!showPopover); }}
        className={`inline-block text-white rounded-full px-2 py-1 text-xs font-bold
          ${countdown < 4 ? "bg-red-600" : "bg-green-600"} 
          ${countdown < 2 ? "animate-pulse" : ""}
          ${hasAircon ? "border-2 border-blue-600" : ""}
        `}
      >
        {countdown}
      </button>
      {showPopover && (timeReal || timePlanned) && (
        <div
        className="absolute z-10 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2"
        >
        {timeReal && timeReal !== "Invalid" ? timeReal : `Planned: ${timePlanned ?? ""}`}
          <div className="absolute w-2 h-2 bg-gray-900 transform rotate-45 -bottom-1 left-1/2 -translate-x-1/2"></div>
        </div>
      )}
      {type === "ptMetro" &&
        hasAircon !== null && (
        <span className="absolute -top-2 -right-1 text-xs" title={hasAircon ? "❄️ A/C available" : "🥵 No A/C"}>
          {hasAircon ? "❄️" : "🥵"}
          </span>
        )}
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
    e.g &apos;/?stopID=4111&amp;stopID=4118&apos; to specify stopIDs.
    <br />
    🍪 This website is cookie-free.
  </div>
);

const ErrorMessage = ({ message }: { message: string }) => (
  <div className="container mx-auto p-2">
    <h1 className="text-xl font-bold text-center mb-2">Vienna Public Transport</h1>
    <div className="text-center text-red-500 font-semibold my-10">{message}</div>
    <Footer />
  </div>
);

const DefaultStopsMessage = () => (
  <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
    <p className="font-bold">Using default stops</p>
    <p>To see departures for specific stops:</p>
    <ol className="list-decimal list-inside mt-1">
      <li>Find valid stop IDs <a href="https://till.mabe.at/rbl/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">here</a></li>
      <li>Add to the web address: <span className="font-mono bg-yellow-200 px-1">/?stopID=4111</span></li>
      <li>For multiple stops, use: <span className="font-mono bg-yellow-200 px-1">/?stopID=4111&amp;stopID=4118</span></li>
    </ol>
  </div>
);

const formatTowards = (towards: string) => {
  const words = towards.toLowerCase().split(" ");
  return words.length > 1
    ? words[0].charAt(0).toUpperCase() + words[0].slice(1) + " " + words.slice(1).join(" ")
    : towards.charAt(0).toUpperCase() + towards.slice(1).toLowerCase();
};