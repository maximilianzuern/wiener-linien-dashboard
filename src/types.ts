export type OutputData = {
  name: string;
  towards: string;
  type: string | undefined;
  countdowns: number[] | undefined;
  timePlanned: string[] | undefined;
  timeReal?: string[] | undefined;
  aircon: (boolean | undefined)[];
};

export interface Welcome {
  data: Data;
  message: Message;
}

export type FetchResult = Record<string, OutputData[]> | { error: string };

interface Data {
  message: any;
  monitors: Monitor[];
}

interface Monitor {
  locationStop: LocationStop;
  lines: Line[];
  attributes: MonitorAttributes;
}

interface MonitorAttributes {}

interface Line {
  name: string;
  towards: string;
  direction?: string;
  platform?: string;
  richtungsId?: string;
  barrierFree?: boolean;
  realtimeSupported?: boolean;
  trafficjam?: boolean;
  departures?: Departures;
  type?: string;
  lineId?: number;
}

interface Departures {
  departure: Departure[];
}

interface Departure {
  departureTime: DepartureTime;
  vehicle: Vehicle;
}

interface DepartureTime {
  timePlanned: string;
  timeReal?: string;
  countdown: number;
}

interface Vehicle {
  name: string;
  towards: string;
  direction: string;
  platform: string;
  richtungsId: string;
  barrierFree: boolean;
  foldingRamp?: boolean;
  foldingRampType?: string;
  realtimeSupported: boolean;
  trafficjam: boolean;
  type: string;
  attributes: MonitorAttributes;
  linienId: number;
}

interface LocationStop {
  type: string;
  geometry: Geometry;
  properties: Properties;
}

interface Geometry {
  type: string;
  coordinates: number[];
}

interface Properties {
  name: string;
  title: string;
  municipality: string;
  municipalityId: number;
  type: string;
  coordName: string;
  gate: string;
  attributes: PropertiesAttributes;
}

interface PropertiesAttributes {
  rbl: number;
}

interface Message {
  value: string;
  messageCode: number;
  serverTime: string;
}
