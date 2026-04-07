import TreeMarketplaceNewPlacesView, {
  RecycleCreditGuide,
} from "@/component/dashboard/TreeMarketplaceNewPlacesView";
import { getGoogleMapsApiKey } from "@/lib/treeMarketplace";

export default function BuyTreePage() {
  const mapsApiKey = getGoogleMapsApiKey();

  return (
    <div className="space-y-6 pb-8">
      <TreeMarketplaceNewPlacesView mapsApiKey={mapsApiKey} />
      <RecycleCreditGuide />
      <TreeMarketplaceNewPlacesView mapsApiKey={mapsApiKey} variant="recycle" />
    </div>
  );
}
