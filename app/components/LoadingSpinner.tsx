import { SkeletonLine, LayerCard, Grid, GridItem } from "@cloudflare/kumo";

export const LoadingSpinner = () => (
  <Grid variant="3up" gap="sm">
    {/* show skeleton loading states three times */}
    {[0, 1, 2].map((item) => (
      <GridItem key={item}>
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
      </GridItem>
    ))}
  </Grid>
);
