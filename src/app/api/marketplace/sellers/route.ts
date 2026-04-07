import { NextRequest, NextResponse } from "next/server";
import { getDistanceInKm } from "@/lib/geoUtils";
import {
  getGoogleMapsApiKey,
  type TreeMarketplacePlace,
  type TreeMarketplacePlacesResponse,
} from "@/lib/treeMarketplace";

export const dynamic = "force-dynamic";

const SEARCH_RADIUS_METERS = 15000;
const MAX_RESULTS = 4;
const SEARCH_QUERIES = ["plant nursery", "garden center", "nursery"];
const PLACES_FIELD_MASK = [
  "places.id",
  "places.displayName",
  "places.formattedAddress",
  "places.shortFormattedAddress",
  "places.location",
  "places.rating",
  "places.userRatingCount",
  "places.photos",
  "places.googleMapsUri",
].join(",");

interface MarketplaceSearchPlace {
  id?: string;
  displayName?: {
    text?: string;
  };
  formattedAddress?: string;
  shortFormattedAddress?: string;
  location?: {
    latitude?: number;
    longitude?: number;
  };
  rating?: number;
  userRatingCount?: number;
  photos?: Array<{
    name?: string;
  }>;
  googleMapsUri?: string;
}

interface SearchTextResponse {
  places?: MarketplaceSearchPlace[];
}

interface NearbySearchResponse {
  places?: MarketplaceSearchPlace[];
}

interface PlacePhotoMediaResponse {
  photoUri?: string;
}

function parseCoordinate(value: string | null) {
  if (!value) {
    return null;
  }

  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function formatDistance(distanceKm: number) {
  if (distanceKm < 1) {
    return `${Math.max(100, Math.round(distanceKm * 1000))} m`;
  }

  return `${distanceKm.toFixed(distanceKm >= 10 ? 0 : 1)} km`;
}

async function fetchJson<T>(input: string, init?: RequestInit) {
  const response = await fetch(input, {
    ...init,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Google request failed with ${response.status}`);
  }

  return (await response.json()) as T;
}

async function getPhotoUrl(photoName: string | undefined, apiKey: string) {
  if (!photoName) {
    return null;
  }

  try {
    const photoResponse = await fetchJson<PlacePhotoMediaResponse>(
      `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=800&skipHttpRedirect=true&key=${apiKey}`
    );

    return photoResponse.photoUri || null;
  } catch {
    return null;
  }
}

function isValidPlace(
  place: MarketplaceSearchPlace
): place is MarketplaceSearchPlace & {
  id: string;
  displayName: { text: string };
  location: { latitude: number; longitude: number };
} {
  return Boolean(
    place.id &&
      place.displayName?.text &&
      place.location?.latitude !== undefined &&
      place.location?.longitude !== undefined
  );
}

async function searchPlaces(apiKey: string, lat: number, lng: number) {
  const uniquePlaces = new Map<
    string,
    MarketplaceSearchPlace & {
      id: string;
      displayName: { text: string };
      location: { latitude: number; longitude: number };
    }
  >();
  let lastError: Error | null = null;

  for (const query of SEARCH_QUERIES) {
    try {
      const response = await fetchJson<SearchTextResponse>(
        "https://places.googleapis.com/v1/places:searchText",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": apiKey,
            "X-Goog-FieldMask": PLACES_FIELD_MASK,
          },
          body: JSON.stringify({
            textQuery: query,
            pageSize: MAX_RESULTS,
            rankPreference: "DISTANCE",
            locationRestriction: {
              circle: {
                center: {
                  latitude: lat,
                  longitude: lng,
                },
                radius: SEARCH_RADIUS_METERS,
              },
            },
          }),
        }
      );

      for (const place of response.places || []) {
        if (!isValidPlace(place) || uniquePlaces.has(place.id)) {
          continue;
        }

        uniquePlaces.set(place.id, place);
      }

      if (uniquePlaces.size >= MAX_RESULTS) {
        break;
      }
    } catch (error) {
      lastError = error instanceof Error ? error : new Error("Seller search failed.");
    }
  }

  if (uniquePlaces.size < MAX_RESULTS) {
    try {
      const nearbyResponse = await fetchJson<NearbySearchResponse>(
        "https://places.googleapis.com/v1/places:searchNearby",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": apiKey,
            "X-Goog-FieldMask": PLACES_FIELD_MASK,
          },
          body: JSON.stringify({
            includedTypes: ["florist"],
            maxResultCount: MAX_RESULTS,
            rankPreference: "DISTANCE",
            locationRestriction: {
              circle: {
                center: {
                  latitude: lat,
                  longitude: lng,
                },
                radius: SEARCH_RADIUS_METERS,
              },
            },
          }),
        }
      );

      for (const place of nearbyResponse.places || []) {
        if (!isValidPlace(place) || uniquePlaces.has(place.id)) {
          continue;
        }

        uniquePlaces.set(place.id, place);
      }
    } catch (error) {
      if (!lastError) {
        lastError = error instanceof Error ? error : new Error("Seller search failed.");
      }
    }
  }

  if (uniquePlaces.size === 0 && lastError) {
    throw lastError;
  }

  return Array.from(uniquePlaces.values());
}

export async function GET(request: NextRequest) {
  const apiKey = getGoogleMapsApiKey();

  if (!apiKey) {
    return NextResponse.json({ error: "Google Maps API key is missing." }, { status: 500 });
  }

  const lat = parseCoordinate(request.nextUrl.searchParams.get("lat"));
  const lng = parseCoordinate(request.nextUrl.searchParams.get("lng"));

  if (lat === null || lng === null) {
    return NextResponse.json({ error: "Valid coordinates are required." }, { status: 400 });
  }

  try {
    const placesResponse = await searchPlaces(apiKey, lat, lng);

    const photoUrls = await Promise.all(
      placesResponse.map((place) => getPhotoUrl(place.photos?.[0]?.name, apiKey))
    );

    const marketplacePlaces: TreeMarketplacePlace[] = placesResponse
      .map((place, index) => {
        const location = {
          lat: place.location.latitude,
          lng: place.location.longitude,
        };
        const distanceKm = getDistanceInKm(lat, lng, location.lat, location.lng);

        return {
          id: place.id,
          name: place.displayName.text,
          address: place.shortFormattedAddress || place.formattedAddress || "Nearby nursery",
          distanceText: formatDistance(distanceKm),
          durationText: "",
          ratingValue: place.rating ?? null,
          ratingCount: place.userRatingCount ?? null,
          photoUrl: photoUrls[index],
          location,
          mapsUrl: place.googleMapsUri || null,
        };
      })
      .sort(
        (firstPlace, secondPlace) =>
          getDistanceInKm(lat, lng, firstPlace.location.lat, firstPlace.location.lng) -
          getDistanceInKm(lat, lng, secondPlace.location.lat, secondPlace.location.lng)
      )
      .slice(0, MAX_RESULTS);

    const response: TreeMarketplacePlacesResponse = {
      origin: { lat, lng },
      places: marketplacePlaces,
    };

    return NextResponse.json(response, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Marketplace seller search failed", error);

    return NextResponse.json(
      { error: "Unable to load nearby nurseries right now." },
      { status: 500 }
    );
  }
}
