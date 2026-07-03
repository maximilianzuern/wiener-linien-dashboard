import { SkeletonLine, LayerCard, Grid, GridItem } from "@cloudflare/kumo";

const LayerCardSkeleton = () => (
  <LayerCard>
    <LayerCard.Secondary>
      <SkeletonLine className="h-4" minWidth={16} maxWidth={32} />
    </LayerCard.Secondary>

    <LayerCard.Primary>
      <div className="space-y-3">
        <SkeletonLine className="h-4" blockHeight={32} minWidth={16} maxWidth={32} />
        <SkeletonLine className="h-4" blockHeight={32} minWidth={48} maxWidth={64} />
      </div>
    </LayerCard.Primary>
  </LayerCard>
);

export const LoadingSkeleton = () => {
  return (
    <Grid variant="3up" gap="sm">
      {[0, 1, 2].map((idx) => (
        <GridItem key={idx}>
          <LayerCardSkeleton />
        </GridItem>
      ))}
    </Grid>
  );
};
