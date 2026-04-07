export interface LatLngLiteral {
  lat: number;
  lng: number;
}

export interface TreeMarketplacePlace {
  id: string;
  name: string;
  address: string;
  distanceText: string;
  durationText: string;
  ratingValue: number | null;
  ratingCount: number | null;
  photoUrl: string | null;
  location: LatLngLiteral;
  mapsUrl: string | null;
}

export interface TreeMarketplaceLocationResponse {
  origin: LatLngLiteral;
  originLabel: string;
  originAddress: string;
}

export interface TreeMarketplacePlacesResponse {
  origin: LatLngLiteral;
  places: TreeMarketplacePlace[];
}

export interface TreeMarketplaceResponse extends TreeMarketplaceLocationResponse {
  places: TreeMarketplacePlace[];
}

export interface TreeMarketplaceRouteResponse {
  distanceText: string;
  durationText: string;
  encodedPolyline: string;
}

export function getGoogleMapsApiKey() {
  return (
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
    process.env.GOOGLE_MAPS_API_KEY ||
    process.env.API_key ||
    ""
  );
}
