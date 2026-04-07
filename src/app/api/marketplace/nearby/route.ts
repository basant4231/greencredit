import { NextRequest, NextResponse } from "next/server";
import { getDistanceInKm } from "@/lib/geoUtils";
import {
  getGoogleMapsApiKey,
  type TreeMarketplacePlace,
  type TreeMarketplaceResponse,
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

interface DistanceMatrixResponse {
  rows?: Array<{
    elements?: Array<{
      distance?: {
        text?: string;
      };
      duration?: {
        text?: string;
      };
      status?: string;
    }>;
  }>;
}

interface GeocodeResponse {
  results?: Array<{
    formatted_address?: string;
    address_components?: Array<{
      long_name?: string;
      types?: string[];
    }>;
  }>;
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

function formatFallbackDistance(originLat: number, originLng: number, destLat: number, destLng: number) {
  const distance = getDistanceInKm(originLat, originLng, destLat, destLng);

  if (distance < 1) {
    return `${Math.max(100, Math.round(distance * 1000))} m`;
  }

  return `${distance.toFixed(distance >= 10 ? 0 : 1)} km`;
}

function getOriginLabel(response: GeocodeResponse) {
  const firstResult = response.results?.[0];

  if (!firstResult) {
    return "Near you";
  }

  const locality =
    firstResult.address_components?.find((component) => component.types?.includes("locality"))?.long_name ||
    firstResult.address_components?.find((component) =>
      component.types?.includes("sublocality_level_1")
    )?.long_name;

  if (locality) {
    return locality;
  }

  return firstResult.formatted_address?.split(",").slice(0, 2).join(", ") || "Near you";
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
  const uniquePlaces = new Map<string, MarketplaceSearchPlace>();
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
      lastError = error instanceof Error ? error : new Error("Search failed.");
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
    const [searchPlacesResponse, geocodeResponse] = await Promise.all([
      searchPlaces(apiKey, lat, lng),
      fetchJson<GeocodeResponse>(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
      ),
    ]);

    const places = searchPlacesResponse.filter(isValidPlace);

    if (places.length === 0) {
      const emptyResponse: TreeMarketplaceResponse = {
        origin: { lat, lng },
        originLabel: getOriginLabel(geocodeResponse),
        places: [],
      };

      return NextResponse.json(emptyResponse, {
        headers: {
          "Cache-Control": "no-store",
        },
      });
    }

    const destinations = places
      .map((place) => `${place.location?.latitude},${place.location?.longitude}`)
      .join("|");

    let distanceMatrixResponse: DistanceMatrixResponse | null = null;

    try {
      distanceMatrixResponse = await fetchJson<DistanceMatrixResponse>(
        `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${lat},${lng}&destinations=${encodeURIComponent(
          destinations
        )}&mode=driving&units=metric&key=${apiKey}`
      );
    } catch {
      distanceMatrixResponse = null;
    }

    const photoUrls = await Promise.all(
      places.map((place) => getPhotoUrl(place.photos?.[0]?.name, apiKey))
    );

    const marketplacePlaces: TreeMarketplacePlace[] = places
      .map((place, index) => {
        const location = {
          lat: place.location.latitude,
          lng: place.location.longitude,
        };
        const matrixElement = distanceMatrixResponse?.rows?.[0]?.elements?.[index];

        return {
          id: place.id,
          name: place.displayName.text || "Nearby nursery",
          address: place.shortFormattedAddress || place.formattedAddress || "Nearby nursery",
          distanceText:
            matrixElement?.distance?.text ||
            formatFallbackDistance(lat, lng, location.lat, location.lng),
          durationText: matrixElement?.duration?.text || "",
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

    const response: TreeMarketplaceResponse = {
      origin: { lat, lng },
      originLabel: getOriginLabel(geocodeResponse),
      places: marketplacePlaces,
    };

    return NextResponse.json(response, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Marketplace nearby search failed", error);

    return NextResponse.json(
      { error: "Unable to load nearby nurseries right now." },
      { status: 500 }
    );
  }
}
