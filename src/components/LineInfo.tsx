import {
  TRANSPORT_EMOJI_LOOKUP,
  MAX_DISPLAYED_COUNTDOWNS,
  AIRCONDITIONED_METROS,
} from "@/constants";
import CountdownBadge from "./CountdownBadge";
import { formatTowards } from "@/utils/formatters";
import type { OutputData } from "@/types";

const LineInfo = ({ line }: { line: OutputData }) => (
  <div className="mb-1 flex items-center">
    <div>
      <div className="font-bold">
        {line.name} {TRANSPORT_EMOJI_LOOKUP[line.type as keyof typeof TRANSPORT_EMOJI_LOOKUP] ?? ""}
      </div>
      <div className="text-gray-500">{formatTowards(line.towards)}</div>
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

export default LineInfo;
