import { Snowflake, Flame } from "lucide-react";
import { useEffect, useState } from "react";

type CountdownBadgeProps = {
  countdown: number;
  timePlanned?: string;
  timeReal?: string;
  type?: string;
  hasAircon?: boolean;
};

const CountdownBadge = ({
  countdown,
  timePlanned,
  timeReal,
  type,
  hasAircon,
}: CountdownBadgeProps) => {
  const [showPopover, setShowPopover] = useState(false);

  const isUrgent = countdown < 2;
  const isImmediate = countdown < 1;
  const isMetro = type === "ptMetro";

  const hasTimingInfo = Boolean(timeReal || timePlanned);
  const shouldShowPopover = showPopover && hasTimingInfo;
  const shouldShowAirconBadge = isMetro && hasAircon != null;

  const popoverText =
    timeReal && timeReal !== "Invalid Date" ? timeReal : `Planned: ${timePlanned ?? ""}`;

  useEffect(() => {
    if (showPopover) {
      const handleClickOutside = () => setShowPopover(false);
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [showPopover]);

  return (
    <span className="relative mr-2 inline-block">
      <button
        onClick={(event) => {
          event.stopPropagation();
          setShowPopover((prev) => !prev);
        }}
        className={`inline-block rounded-full px-2 py-1 text-xs font-bold text-white ${isUrgent ? "bg-orange-600" : "bg-green-600"} ${isImmediate ? "animate-pulse" : ""} ${hasAircon ? "border-2 border-blue-600" : ""}`}
      >
        {countdown}
      </button>

      {shouldShowPopover && (
        <div className="absolute bottom-full left-1/2 z-10 -translate-x-1/2 -translate-y-2 transform rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white">
          {popoverText}
          <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 transform bg-gray-900"></div>
        </div>
      )}

      {shouldShowAirconBadge && (
        <span
          className="absolute -top-2.5 -right-1.5 inline-flex h-4 w-4 items-center justify-center text-sm leading-none"
          title={hasAircon ? "❄️ A/C available" : "🥵 No A/C"}
        >
          {hasAircon ? (
            <Snowflake className="h-4 w-4 text-blue-500" />
          ) : (
            <Flame className="h-4 w-4 text-orange-600" />
          )}
        </span>
      )}
    </span>
  );
};

export default CountdownBadge;
