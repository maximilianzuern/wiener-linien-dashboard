import { Badge, Popover } from "@cloudflare/kumo";
import { Snowflake, Flame } from "lucide-react";

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
  const isImmediate = countdown == 0;
  const isMetro = type === "ptMetro";

  const hasTimingInfo = Boolean(timeReal || timePlanned);
  const shouldShowAirconBadge = isMetro && hasAircon != null;

  const popoverText =
    timeReal && timeReal !== "Invalid Date" ? timeReal : `Planned: ${timePlanned ?? ""}`;

  const countdownBadge = (
    <Badge className={`font-bold ${isImmediate ? "animate-pulse" : ""}`} variant="green">
      {countdown}
    </Badge>
  );

  return (
    <span className="relative inline-block">
      {hasTimingInfo ? (
        <Popover>
          <Popover.Trigger
            openOnHover
            delay={150}
            aria-label={`Show departure time for ${countdown} minute countdown`}
          >
            {countdownBadge}
          </Popover.Trigger>
          <Popover.Content side="top">
            <Popover.Description>{popoverText}</Popover.Description>
          </Popover.Content>
        </Popover>
      ) : (
        countdownBadge
      )}

      {shouldShowAirconBadge && (
        <span
          className="absolute -top-2.5 -right-1.5 inline-flex h-4 w-4 items-center justify-center text-sm leading-none"
          title={hasAircon ? "❄️ A/C available" : "🥵 No A/C"}
        >
          {hasAircon ? (
            <Snowflake className="h-4 w-4 text-blue-500" stroke-width="2" />
          ) : (
            <Flame className="h-4 w-4 text-orange-600" stroke-width="3" />
          )}
        </span>
      )}
    </span>
  );
};

export default CountdownBadge;
