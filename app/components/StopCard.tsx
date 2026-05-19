import type { ParsedStop } from "~/appTypes/output.types";

import LineInfo from "./LineInfo";

const StopCard = ({ stop }: { stop: ParsedStop }) => (
  <div className="rounded-lg bg-white p-3 shadow-lg">
    <h3 className="border-b-1 border-gray-200 text-xl font-semibold">{stop.title}</h3>

    <div className="mt-2">
      {stop.lines.map((line, index) => (
        <LineInfo key={`${line.name}-${line.towards}-${index}`} line={line} />
      ))}
    </div>
  </div>
);

export default StopCard;
