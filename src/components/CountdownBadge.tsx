import { useState, useEffect } from "react";

const CountdownBadge = ({
  countdown,
  timePlanned,
  timeReal,
  type,
  hasAircon,
}: {
  countdown: number;
  timePlanned?: string;
  timeReal?: string;
  type?: string;
  hasAircon?: boolean;
}) => {
  const [showPopover, setShowPopover] = useState(false);

  useEffect(() => {
    if (showPopover) {
      const handleClickOutside = () => setShowPopover(false);
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [showPopover]);

  return (
    <span className="relative inline-block mr-2">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowPopover(!showPopover);
        }}
        className={`inline-block text-white rounded-full px-2 py-1 text-xs font-bold
          ${countdown < 4 ? "bg-red-600" : "bg-green-600"} 
          ${countdown < 2 ? "animate-pulse" : ""}
          ${hasAircon ? "border-2 border-blue-600" : ""}
        `}
      >
        {countdown}
      </button>
      {showPopover && (timeReal || timePlanned) && (
        <div className="absolute z-10 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2">
          {timeReal && timeReal !== "Invalid Date" ? timeReal : `Planned: ${timePlanned ?? ""}`}
          <div className="absolute w-2 h-2 bg-gray-900 transform rotate-45 -bottom-1 left-1/2 -translate-x-1/2"></div>
        </div>
      )}
      {type === "ptMetro" && hasAircon !== null && (
        <span
          className="absolute -top-2 -right-1 text-xs"
          title={hasAircon ? "❄️ A/C available" : "🥵 No A/C"}
        >
          {hasAircon ? "❄️" : "🥵"}
        </span>
      )}
    </span>
  );
};

export default CountdownBadge;
