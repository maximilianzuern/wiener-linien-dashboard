export type ParsedDeparture = {
  countdown: number;
  timePlanned?: string;
  timeReal?: string;
  aircon?: boolean;
};

export type ParsedDisruption = {
  title: string;
  description: string;
  status: string;
  created?: string;
  start?: string;
  resume?: string;
  lastUpdate?: string;
};

export type ParsedLine = {
  name: string;
  towards: string;
  type: string;
  departures: ParsedDeparture[];
  disruptions: ParsedDisruption[];
};

export type ParsedStop = {
  stopIds: number[];
  title: string;
  lines: ParsedLine[];
};

export type ParsedMonitorData = {
  serverTime: string;
  returnedStopIds: number[];
  stops: ParsedStop[];
};
