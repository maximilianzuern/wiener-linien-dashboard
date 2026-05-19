import type { ParsedLine } from "~/appTypes/output.types";

import {
  TRANSPORT_ICON_LOOKUP,
  MAX_DISPLAYED_COUNTDOWNS,
  AIRCONDITIONED_METROS,
} from "../utils/constants";
import { formatTowards } from "../utils/formatters";
import { getLineBackgroundColor } from "../utils/lineBackground";
import CountdownBadge from "./CountdownBadge";
import DisruptAlert from "./DisruptAlert";

const LineInfo = ({ line }: { line: ParsedLine }) => (
  <div className="mb-2">
    <div className="flex items-center">
      <div>
        <div className="flex items-center gap-2 text-lg font-bold">
          <span
            className={`${getLineBackgroundColor(
              line.name,
            )} rounded px-1.5 py-1 text-[13px] text-white`}
          >
            {line.name}
          </span>
          {TRANSPORT_ICON_LOOKUP[line.type as keyof typeof TRANSPORT_ICON_LOOKUP] ?? ""}
        </div>
        <div className="text-gray-700">{formatTowards(line.towards)}</div>
      </div>
      <div className="mt-6 ml-2">
        {line.departures.slice(0, MAX_DISPLAYED_COUNTDOWNS).map((departure, i) => (
          <CountdownBadge
            key={i}
            countdown={departure.countdown}
            hasAircon={AIRCONDITIONED_METROS.includes(line.name) || departure.aircon}
            type={line.type}
            timePlanned={departure.timePlanned}
            timeReal={departure.timeReal}
          />
        ))}
      </div>
    </div>
    {line.disruptions.length > 0 && <DisruptAlert disruptions={line.disruptions} />}
  </div>
);

export default LineInfo;
