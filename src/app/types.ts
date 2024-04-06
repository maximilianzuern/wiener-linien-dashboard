export interface Welcome {
  data: Data;
  message: Message;
}

export interface Data {
  monitors: Monitor[];
}

export interface Monitor {
  locationStop: LocationStop;
  lines: Line[];
  attributes: MonitorAttributes;
}

export interface MonitorAttributes {}

export interface Line {
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

export interface Departures {
  departure: Departure[];
}

export interface Departure {
  departureTime: DepartureTime;
  vehicle: Vehicle;
}

export interface DepartureTime {
  timePlanned: string;
  countdown: number;
  timeReal?: string;
}

export interface Vehicle {
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

export interface LocationStop {
  type: string;
  geometry: Geometry;
  properties: Properties;
}

export interface Geometry {
  type: string;
  coordinates: number[];
}

export interface Properties {
  name: string;
  title: string;
  municipality: string;
  municipalityId: number;
  type: string;
  coordName: string;
  gate: string;
  attributes: PropertiesAttributes;
}

export interface PropertiesAttributes {
  rbl: number;
}

export interface Message {
  value: string;
  messageCode: number;
  serverTime: string;
}

export type OutputData = {
  name: string;
  towards: string;
  countdowns: number[] | undefined;
};