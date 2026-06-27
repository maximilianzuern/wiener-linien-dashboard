import { LayerCard, Text } from "@cloudflare/kumo";

import type { ParsedStop } from "~/appTypes/output.types";

import LineInfo from "./LineInfo";

const StopCard = ({ stop }: { stop: ParsedStop }) => (
  <LayerCard className="h-full">
    <LayerCard.Secondary>
      <Text variant="heading3" as="h3">
        {stop.title}
      </Text>
    </LayerCard.Secondary>

    <LayerCard.Primary>
      {stop.lines.map((line, index) => (
        <LineInfo key={`${line.name}-${line.towards}-${index}`} line={line} />
      ))}
    </LayerCard.Primary>
  </LayerCard>
);

export default StopCard;
