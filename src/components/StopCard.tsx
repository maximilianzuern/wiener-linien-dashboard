import LineInfo from "./LineInfo";
import type { OutputData } from "@/types";

const StopCard = ({ title, lines }: { title: string; lines: OutputData[] }) => (
  <div className="bg-white shadow-lg rounded-lg p-3">
    <h3 className="text-xl font-semibold mt-1 border-b-2 border-gray-200">{title}</h3>
    <div className="mt-4">
      {lines.map((line) => (
        <LineInfo key={line.name} line={line} />
      ))}
    </div>
  </div>
);

export default StopCard;
