import { NextRequest, NextResponse } from "next/server";
import {
  getGoogleMapsApiKey,
  type TreeMarketplaceLocationResponse,
} from "@/lib/treeMarketplace";

export const dynamic = "force-dynamic";

interface GeocodeResponse {
  results?: Array<{
    formatted_address?: string;
    address_components?: Array<{
      long_name?: string;
      types?: string[];
    }>;
  }>;
}

function parseCoordinate(value: string | null) {
  if (!value) {
    return null;
  }

  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function getOriginLabel(response: GeocodeResponse) {
  const firstResult = response.results?.[0];

  if (!firstResult) {
    return "Near you";
  }

  const locality =
    firstResult.address_components?.find((component) => component.types?.includes("locality"))
      ?.long_name ||
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
    const geocodeResponse = await fetchJson<GeocodeResponse>(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
    );

    const response: TreeMarketplaceLocationResponse = {
      origin: { lat, lng },
      originLabel: getOriginLabel(geocodeResponse),
      originAddress: geocodeResponse.results?.[0]?.formatted_address || "Current location",
    };

    return NextResponse.json(response, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Marketplace location lookup failed", error);

    return NextResponse.json(
      { error: "Unable to determine the current location right now." },
      { status: 500 }
    );
  }
}
