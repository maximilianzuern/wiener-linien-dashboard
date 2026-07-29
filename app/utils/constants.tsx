import type { ReactNode } from "react";

import { TramIcon, BusIcon, MetroIcon, TrainIcon } from "../components/TransportIcon";

export const MAX_CUSTOM_STOP_IDS: number = 10;
export const DEFAULT_STOP_IDS: number[] = [4111, 4118];
export const MAX_COUNTDOWN_MINUTES: number = 45;
export const MAX_DISPLAYED_COUNTDOWNS: number = 5;
export const TRANSPORT_ICON_LOOKUP: Record<string, ReactNode> = {
  ptTram: <TramIcon />,
  ptTramWLB: <TramIcon />,
  ptBusCity: <BusIcon />,
  ptBusNight: <BusIcon />,
  ptMetro: <MetroIcon />,
  ptTrainS: <TrainIcon />,
};
