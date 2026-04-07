import { NextRequest, NextResponse } from "next/server";
import {
  getGoogleMapsApiKey,
  type TreeMarketplaceRouteResponse,
} from "@/lib/treeMarketplace";

export const dynamic = "force-dynamic";

interface ComputeRoutesResponse {
  routes?: Array<{
    distanceMeters?: number;
    duration?: string;
    polyline?: {
      encodedPolyline?: string;
    };
  }>;
}

function parseCoordinate(value: string | null) {
  if (!value) {
    return null;
  }

  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function formatDistance(distanceMeters?: number) {
  if (!distanceMeters) {
    return "";
  }

  if (distanceMeters < 1000) {
    return `${Math.round(distanceMeters)} m`;
  }

  const distanceKm = distanceMeters / 1000;
  return `${distanceKm.toFixed(distanceKm >= 10 ? 0 : 1)} km`;
}

function formatDuration(duration?: string) {
  if (!duration) {
    return "";
  }

  const totalSeconds = Number.parseInt(duration.replace("s", ""), 10);

  if (!Number.isFinite(totalSeconds)) {
    return "";
  }

  const totalMinutes = Math.round(totalSeconds / 60);

  if (totalMinutes < 60) {
    return `${totalMinutes} min`;
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (minutes === 0) {
    return `${hours} hr`;
  }

  return `${hours} hr ${minutes} min`;
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

export async function GET(request: NextRequest) {
  const apiKey = getGoogleMapsApiKey();

  if (!apiKey) {
    return NextResponse.json({ error: "Google Maps API key is missing." }, { status: 500 });
  }

  const originLat = parseCoordinate(request.nextUrl.searchParams.get("originLat"));
  const originLng = parseCoordinate(request.nextUrl.searchParams.get("originLng"));
  const destinationLat = parseCoordinate(request.nextUrl.searchParams.get("destinationLat"));
  const destinationLng = parseCoordinate(request.nextUrl.searchParams.get("destinationLng"));

  if (
    originLat === null ||
    originLng === null ||
    destinationLat === null ||
    destinationLng === null
  ) {
    return NextResponse.json({ error: "Valid route coordinates are required." }, { status: 400 });
  }

  try {
    const routeResponse = await fetchJson<ComputeRoutesResponse>(
      "https://routes.googleapis.com/directions/v2:computeRoutes",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask": "routes.distanceMeters,routes.duration,routes.polyline.encodedPolyline",
        },
        body: JSON.stringify({
          origin: {
            location: {
              latLng: {
                latitude: originLat,
                longitude: originLng,
              },
            },
          },
          destination: {
            location: {
              latLng: {
                latitude: destinationLat,
                longitude: destinationLng,
              },
            },
          },
          travelMode: "DRIVE",
          routingPreference: "TRAFFIC_AWARE",
          polylineQuality: "HIGH_QUALITY",
          languageCode: "en-US",
          units: "METRIC",
        }),
      }
    );

    const route = routeResponse.routes?.[0];

    if (!route?.polyline?.encodedPolyline) {
      return NextResponse.json({ error: "No route available." }, { status: 404 });
    }

    const response: TreeMarketplaceRouteResponse = {
      distanceText: formatDistance(route.distanceMeters),
      durationText: formatDuration(route.duration),
      encodedPolyline: route.polyline.encodedPolyline,
    };

    return NextResponse.json(response, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json({ error: "Unable to load route right now." }, { status: 500 });
  }
}
