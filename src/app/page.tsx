"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { FetchResult } from "@/types";
import { fetchData } from "@/utils/api";
import { DEFAULT_STOP_IDS } from "@/constants";
import ErrorMessage from "@/components/ErrorMessage";
import DefaultStopsMessage from "@/components/DefaultStopsMessage";
import StopCard from "@/components/StopCard";
import Footer from "@/components/Footer";

export default function Home() {
  const [data, setData] = useState<FetchResult | null>(null);
  const searchParams = useSearchParams();

  const getStopIDs = useCallback(() => {
    const params = searchParams.getAll("stopID");
    return params.length > 0 ? params.map(Number) : DEFAULT_STOP_IDS;
  }, [searchParams]);

  // validate the searchParams
  const invalidKey = Array.from(searchParams.keys()).some((key) => key.toLowerCase() !== "stopid");
  const query = Array.from(searchParams.values()).map(Number);

  useEffect(() => {
    if (!invalidKey) {
      const stopIDs = getStopIDs();
      fetchData(stopIDs).then(setData);
    }
  }, [getStopIDs, invalidKey]);

  if (invalidKey) return <ErrorMessage message="Invalid stopID key in URL." />;
  if (data?.error) return <ErrorMessage message={data.error.toString()} />;

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
