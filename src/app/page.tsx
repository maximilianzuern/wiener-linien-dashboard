"use client";
import { useEffect, useState } from "react";
import type { Welcome, OutputData } from "./types";
import { useSearchParams } from "next/navigation";

// to get the stopID -> https://till.mabe.at/rbl/
async function fetchData(stopIDs: number[] = []) {
  // default stopIDs
  if (stopIDs.length === 0) {
    stopIDs = [4111, 4118];
  }
  const query = stopIDs.map((id) => `stopID=${id}`).join("&");
  let res;
  try {
    res = await fetch(`/api/proxy?${query}`);
  } catch (error) {
    return {
      error: `Network error: ${error}`,
    };
  }

  if (res.status !== 200) {
    return {
      error: `Not able to reach Wiener Linien API! status: ${res.status}`,
    };
  }

  let data = {} as Welcome;
  try {
    data = await res.json();
  } catch (e) {
    return {
      error: "Wiener Linien API does not provide a valid JSON response",
    };
  }

  if (!data.data.monitors[0].lines) {
    if (data.data.message.value === "OK") {
      return { error: "Wrong STOP ID!" };
    }
    return { error: "Wiener Linien API response structure is invalid." };
  }

  return data;
}

function parseData(data: Welcome) {
  const result: Record<string, OutputData[]> = {};

  data.data.monitors.forEach((monitor) => {
    const title = monitor.locationStop.properties.title;

    monitor.lines.forEach((line) => {
      const name = line.name;
      const towards = line.towards;
      const countdowns = line.departures?.departure
        .map((departure) => departure.departureTime.countdown)
        .filter((countdown) => countdown <= 30);
      const newLine = { name, towards, countdowns };

      if (!result[title]) {
        result[title] = [];
      }
      result[title].push(newLine);
    });
  });
  return Object.fromEntries(Object.entries(result).sort());
}

export default function Home() {
  const [data, setData] = useState<Welcome>();
  const [error, setError] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<Record<string, OutputData[]>>();

  const searchParams = useSearchParams();
  const query = searchParams.getAll("stopID").map(Number);

  useEffect(() => {
    fetchData(query).then((data) => setData(data as Welcome));
  }, []);

  useEffect(() => {
    try {
      if (data) {
        setParsedData(parseData(data));
      }
    } catch (e) {
      setError("Real time data not available. 😓🚨");
    }
  }, [data]);

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
    </div>
  );

  if (data && "error" in data) {
    return (
      <div className="container mx-auto p-2">
        <h1 className="text-xl font-bold text-center mb-2">Public Transport</h1>
        <div className="text-center text-red-500 font-semibold my-10">
          {String(data.error)}
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-2">
      <h1 className="text-xl font-bold text-center mb-1">Public Transport</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3">
        {parsedData &&
          Object.entries(parsedData).map(([title, lines]) => (
            <div className="bg-white shadow-lg rounded-lg p-3" key={title}>
              <div className="border-b-2 border-gray-200">
                <h3 className="text-xl font-semibold mt-1">{title}</h3>
              </div>
              <div className="mt-4">
                {lines.map((line) => (
                  <div key={line.name} className="mb-1 flex items-center">
                    <div>
                      <div className="font-bold">{line.name}</div>
                      <div className="text-gray-500">{line.towards}</div>
                    </div>
                    <div className="ml-3 mt-5">
                      {line.countdowns?.map((countdown: number, i: number) => (
                        <span
                          key={i}
                          className={`inline-block text-white rounded-full px-2 py-1 text-xs font-bold mr-1 ${
                            countdown < 4 ? "bg-red-500" : "bg-green-500"
                          }`}
                        >
                          {countdown}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
    </div>
    <Footer />
  </div>
);
}
