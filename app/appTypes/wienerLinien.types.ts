export interface WienerLinienResponse {
  data: Data;
  message: Message;
}

type EmptyObject = Record<string, unknown>;

interface Data {
  message: Message;
  monitors: Monitor[];
  trafficInfos?: TrafficInfo[];
}

interface Message {
  value: string;
  messageCode: number;
  serverTime: string;
}

interface Monitor {
  locationStop: LocationStop;
  lines: Line[];
  attributes: EmptyObject;
}

interface Line {
  name: string;
  towards: string;
  direction?: string;
  platform?: string;
  richtungsId?: string;
  barrierFree?: boolean;
  realtimeSupported?: boolean;
  trafficjam?: boolean;
  departures: Departures;
  type: string;
  lineId?: number;
}

interface Departures {
  departure: Departure[];
}

interface Departure {
  departureTime: DepartureTime;
  vehicle?: Vehicle;
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
  cooling: boolean;
  onStop?: boolean;
  realtimeSupported: boolean;
  trafficjam: boolean;
  type: string;
  attributes: EmptyObject;
  linienId: number;
}

interface LocationStop {
  type: string;
  geometry: Geometry;
  properties: Properties;
}

interface Geometry {
  type: string;
  coordinates: (number | null)[];
}

interface Properties {
  name: string;
  title: string;
  municipality: string;
  municipalityId: number;
  type: string;
  coordName: string;
  gate?: string;
  attributes: PropertiesAttributes;
}

interface PropertiesAttributes {
  rbl: number;
}

interface TrafficInfo {
  title: string;
  description: string;
  status: string;
  time: TrafficInfoTime;
  relatedLines?: string[];
  relatedStops?: number[];
}

interface TrafficInfoTime {
  created?: string;
  start?: string;
  resume?: string;
  lastUpdate?: string;
}
