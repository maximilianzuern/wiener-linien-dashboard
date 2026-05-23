import { AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

import type { ParsedDisruption } from "~/appTypes/output.types";

export default function DisruptAlert({ disruptions }: { disruptions: ParsedDisruption[] }) {
  const [isOpen, setIsOpen] = useState(false);

  const activeDisruptions = disruptions.filter((disruption) => disruption.status === "active");

  if (activeDisruptions.length === 0) return null;

  const firstDisruption = activeDisruptions[0];
  const hasMultipleDisruptions = activeDisruptions.length > 1;
  const buttonLabel = hasMultipleDisruptions
    ? `${activeDisruptions.length} disruptions`
    : firstDisruption.title;

  return (
    <div className="mt-2 mb-2 overflow-hidden rounded-md border border-orange-300 bg-orange-50 text-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between gap-2 p-2 text-left text-orange-800 hover:bg-orange-100"
      >
        <div className="flex min-w-0 flex-1 items-center gap-2 font-medium">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <div className="flex min-w-0 flex-1 items-baseline justify-between gap-3">
            <span>{buttonLabel}</span>
            {!hasMultipleDisruptions && firstDisruption.lastUpdate && (
              <span className="shrink-0 text-xs font-normal text-orange-700">
                Updated {firstDisruption.lastUpdate}
              </span>
            )}
          </div>
        </div>
        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>

      {isOpen && (
        <div className="border-t border-orange-200 bg-white text-orange-900">
          {activeDisruptions.map((disruption, index) => (
            <div
              key={`${disruption.title}-${index}`}
              className={index === 0 ? "p-2" : "border-t border-orange-200 p-2"}
            >
              {hasMultipleDisruptions && (
                <div className="flex items-baseline justify-between gap-3">
                  <p className="font-medium">{disruption.title}</p>
                  {disruption.lastUpdate && (
                    <span className="shrink-0 text-xs text-orange-700">
                      Updated {disruption.lastUpdate}
                    </span>
                  )}
                </div>
              )}
              <p className={hasMultipleDisruptions ? "mt-1" : ""}>{disruption.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
