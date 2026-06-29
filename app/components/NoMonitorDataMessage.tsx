import { Banner, Text } from "@cloudflare/kumo";
import { AlertTriangle } from "lucide-react";

export const NoMonitorDataMessage = ({ stopIds }: { stopIds: number[] }) => (
  <Banner
    className="mb-4"
    icon={<AlertTriangle className="h-5 w-5" />}
    variant="alert"
    title="Missing monitor data"
    description={
      <Text DANGEROUS_className="text-inherit">
        No monitor data for stopID(s): <strong>{stopIds.join(", ")}</strong>. They may be invalid,
        or currently have no realtime departures.
      </Text>
    }
  />
);
