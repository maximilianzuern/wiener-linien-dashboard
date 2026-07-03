import { Grid, GridItem } from "@cloudflare/kumo";
import { Suspense } from "react";
import { Await } from "react-router";

import { LoadingSkeleton } from "~/components/LoadingSkeleton";
import { NoMonitorDataMessage } from "~/components/NoMonitorDataMessage";

import type { ParsedMonitorData } from "../appTypes/output.types";
import DefaultStopsMessage from "../components/DefaultStopsMessage";
import StopCard from "../components/StopCard";
import { fetchDefaultDemoData, fetchMonitorData } from "../services/wienerLinien.server";
import { MAX_CUSTOM_STOP_IDS } from "../utils/constants";
import type { Route } from "./+types/home";

type MonitorData = {
  data: ParsedMonitorData;
  unresolvedStopIds: number[];
};

function getUnresolvedStopIds(requestedStopIds: string[], returnedStopIds: number[]) {
  const requestedStopIdNumbers = [...new Set(requestedStopIds.map(Number))];
  const returnedStopIdSet = new Set(returnedStopIds);

  return requestedStopIdNumbers.filter((stopId) => !returnedStopIdSet.has(stopId));
}

export function meta(_args: Route.MetaArgs) {
  return [
    { title: "Public Transport" },
    { name: "description", content: "Real-time public transport departures in Vienna." },
  ];
}

export function headers() {
  return {
    "Cache-Control": "public, max-age=0, s-maxage=5",
  };
}

export async function loader({ request }: Route.LoaderArgs) {
  const searchParams = new URL(request.url).searchParams;
  const requestedStopIds = [...searchParams.getAll("stopID"), ...searchParams.getAll("id")];
  const hasCustomStops = requestedStopIds.length > 0;

  if (hasCustomStops && requestedStopIds.length > MAX_CUSTOM_STOP_IDS) {
    throw new Response("Too many stopIDs provided. Please limit to 10.", { status: 414 });
  }

  const hasInvalidStopId = requestedStopIds.some((stopId) => Number.isNaN(Number(stopId)));
  if (hasInvalidStopId) {
    throw new Response("Invalid stopID provided. Please use numbers only.", { status: 400 });
  }

  if (!hasCustomStops) {
    const monitorData = fetchDefaultDemoData().then(
      (data): MonitorData => ({ data, unresolvedStopIds: [] }),
    );

    return { monitorData, hasCustomStops };
  }

  const monitorData = fetchMonitorData(requestedStopIds, request.signal)
    .then((data) => ({
      data,
      // Unresolved can indicate an invalid stopId OR a valid stop with currently no realtime data.
      unresolvedStopIds: getUnresolvedStopIds(requestedStopIds, data.returnedStopIds),
    }))
    .catch((err) => {
      if (err instanceof Response) throw err;
      throw new Response("Wiener Linien data is temporarily unavailable.", { status: 503 });
    });

  return { monitorData, hasCustomStops };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { monitorData, hasCustomStops } = loaderData;

  return (
    <div className="container mx-auto p-2">
      <h1 className="mb-1 text-center text-xl font-bold">Vienna Public Transport</h1>
      {!hasCustomStops && <DefaultStopsMessage />}

      <Suspense fallback={<LoadingSkeleton />}>
        <Await resolve={monitorData}>
          {({ data, unresolvedStopIds }: MonitorData) => {
            return (
              <>
                {unresolvedStopIds.length > 0 && (
                  <NoMonitorDataMessage stopIds={unresolvedStopIds} />
                )}

                <Grid variant="3up" gap="sm">
                  {data.stops.map((stop) => (
                    <GridItem key={stop.title}>
                      <StopCard stop={stop} />
                    </GridItem>
                  ))}
                </Grid>
              </>
            );
          }}
        </Await>
      </Suspense>
    </div>
  );
}
