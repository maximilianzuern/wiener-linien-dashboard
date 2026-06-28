import { LayerCard, Text } from "@cloudflare/kumo";

import type { ParsedStop } from "~/appTypes/output.types";

import LineInfo from "./LineInfo";

const StopCard = ({ stop }: { stop: ParsedStop }) => (
  <LayerCard>
    <LayerCard.Secondary>
      <Text variant="heading3" as="label" truncate>
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
