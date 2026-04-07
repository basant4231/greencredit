"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { LoaderCircle, MapPin, Star } from "lucide-react";
import { getDistanceInKm, NEAREST_METRO } from "@/lib/geoUtils";
import plantPreview from "@/images/image.png";
import type { LatLngLiteral, TreeMarketplacePlace } from "@/lib/treeMarketplace";

interface GoogleMapsMap {
  fitBounds(bounds: GoogleMapsLatLngBounds, padding?: number): void;
  setCenter(center: LatLngLiteral): void;
  setZoom(zoom: number): void;
}

interface GoogleMapsMarker {
  setMap(map: GoogleMapsMap | null): void;
  addListener(eventName: string, handler: () => void): void;
}

interface GoogleMapsLatLngBounds {
  extend(point: LatLngLiteral): void;
}

interface GoogleMapsLatLng {
  lat(): number;
  lng(): number;
}

interface GoogleMapsGeocoderResult {
  formatted_address?: string;
  address_components?: Array<{
    long_name?: string;
    types?: string[];
  }>;
}

interface GoogleMapsGeocoder {
  geocode(request: { location: LatLngLiteral }): Promise<{
    results: GoogleMapsGeocoderResult[];
  }>;
}

interface GoogleMapsPhoto {
  getURI(options?: {
    maxWidth?: number;
    maxHeight?: number;
  }): string;
}

interface GoogleMapsPlaceResult {
  id?: string;
  displayName?: string | null;
  formattedAddress?: string;
  location?: GoogleMapsLatLng;
  rating?: number;
  userRatingCount?: number;
  photos?: GoogleMapsPhoto[];
  googleMapsURI?: string;
}

interface GoogleMapsPlacesLibrary {
  Place: {
    searchByText(request: {
      textQuery: string;
      fields: string[];
      locationBias: {
        center: LatLngLiteral;
        radius: number;
      };
      maxResultCount: number;
      rankPreference?: string;
      region?: string;
      language?: string;
    }): Promise<{
      places: GoogleMapsPlaceResult[];
    }>;
  };
  SearchByTextRankPreference: {
    DISTANCE: string;
  };
}

interface GoogleMapsGeocodingLibrary {
  Geocoder: new () => GoogleMapsGeocoder;
}

interface GoogleMapsNamespace {
  maps: {
    importLibrary: (name: string) => Promise<unknown>;
    Map: new (
      element: HTMLElement,
      options: {
        center: LatLngLiteral;
        zoom: number;
        disableDefaultUI: boolean;
        zoomControl: boolean;
        clickableIcons: boolean;
        gestureHandling: string;
      }
    ) => GoogleMapsMap;
    Marker: new (options: {
      map: GoogleMapsMap;
      position: LatLngLiteral;
      title: string;
      icon: {
        path: unknown;
        scale: number;
        fillColor: string;
        fillOpacity: number;
        strokeColor: string;
        strokeWeight: number;
      };
    }) => GoogleMapsMarker;
    LatLngBounds: new () => GoogleMapsLatLngBounds;
    SymbolPath: {
      CIRCLE: unknown;
    };
  };
}

type GoogleWindow = Window &
  typeof globalThis & {
    google?: GoogleMapsNamespace;
  };

interface TreeMarketplaceNewPlacesViewProps {
  mapsApiKey: string;
  variant?: "plants" | "recycle";
}

let googleMapsLoaderPromise: Promise<void> | null = null;
const MOVE_THRESHOLD_KM = 10;
const SEARCH_RADIUS_METERS = 15000;
const MAX_RESULTS = 4;
const EMPTY_MARKETPLACE_PLACES: TreeMarketplacePlace[] = [];

interface MarketplaceSectionConfig {
  title: string;
  cacheKey: string;
  queryKey: string;
  searchQueries: string[];
  addressFallback: string;
  emptyMessage: string;
  errorMessage: string;
  fallbackDescription: string;
  ratingsDescriptionSuffix: string;
  placeholderLabel: string;
  mapBackgroundClassName: string;
}

interface RecycleCreditItem {
  name: string;
  credits: string;
  measure: string;
  detail: string;
}

const MARKETPLACE_SECTION_CONFIG: Record<NonNullable<TreeMarketplaceNewPlacesViewProps["variant"]>, MarketplaceSectionConfig> = {
  plants: {
    title: "Buy tree and plant",
    cacheKey: "greencredit-buy-tree-marketplace-cache",
    queryKey: "buy-tree-marketplace",
    searchQueries: ["plant nursery", "garden center", "nursery", "florist"],
    addressFallback: "Nearby nursery",
    emptyMessage: "No nearby plant nurseries were found for this location.",
    errorMessage: "Unable to load nearby nurseries right now.",
    fallbackDescription: "Nearby plant nursery available for exploration.",
    ratingsDescriptionSuffix: "people rated this place on Google.",
    placeholderLabel: "Plant nursery",
    mapBackgroundClassName: "bg-[#ede7f8]",
  },
  recycle: {
    title: "Nearby recycle centres",
    cacheKey: "greencredit-buy-tree-recycle-centres-cache",
    queryKey: "buy-tree-recycle-centres",
    searchQueries: [
      "recycling center",
      "recycling centre",
      "scrap dealer",
      "metal recycling center",
      "plastic recycling center",
    ],
    addressFallback: "Nearby recycling centre",
    emptyMessage: "No nearby recycling centres were found for this location.",
    errorMessage: "Unable to load nearby recycling centres right now.",
    fallbackDescription: "Nearby recycling centre available for drop-off and pickup.",
    ratingsDescriptionSuffix: "Google reviews available for this recycling centre.",
    placeholderLabel: "Recycling centre",
    mapBackgroundClassName: "bg-[#e8f4ea]",
  },
};

const RECYCLE_CREDIT_ITEMS: RecycleCreditItem[] = [
  {
    name: "Iron",
    credits: "18 credits",
    measure: "per kg",
    detail: "Heavy scrap like grills, rods, old tools, and sheets.",
  },
  {
    name: "Plastic",
    credits: "10 credits",
    measure: "per kg",
    detail: "Bottles, containers, and sorted household plastic waste.",
  },
  {
    name: "Paper",
    credits: "8 credits",
    measure: "per kg",
    detail: "Newspapers, office paper, cartons, and clean cardboard.",
  },
  {
    name: "Glass",
    credits: "7 credits",
    measure: "per kg",
    detail: "Bottles and jars that are clean and ready for collection.",
  },
  {
    name: "Aluminium",
    credits: "22 credits",
    measure: "per kg",
    detail: "Cans, lightweight metal parts, and household aluminium scrap.",
  },
  {
    name: "E-waste",
    credits: "35 credits",
    measure: "per device",
    detail: "Small electronics like chargers, routers, keyboards, and mixers.",
  },
];

const CARD_TITLE_CLAMP_STYLE = {
  display: "-webkit-box",
  WebkitBoxOrient: "vertical" as const,
  WebkitLineClamp: 2,
  overflow: "hidden",
};

interface TreeMarketplaceCacheEntry {
  origin: LatLngLiteral;
  originLabel: string;
  places: TreeMarketplacePlace[];
  savedAt: number;
}

function noopSubscribe() {
  return () => {};
}

function getGoogleWindow() {
  return window as GoogleWindow;
}

function readMarketplaceCacheSnapshot(cacheKey: string) {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage.getItem(cacheKey);
  } catch {
    return null;
  }
}

function parseMarketplaceCacheSnapshot(snapshot: string | null | undefined) {
  if (!snapshot) {
    return undefined;
  }

  try {
    return JSON.parse(snapshot) as TreeMarketplaceCacheEntry;
  } catch {
    return undefined;
  }
}

function readMarketplaceCache(cacheKey: string) {
  return parseMarketplaceCacheSnapshot(readMarketplaceCacheSnapshot(cacheKey));
}

function writeMarketplaceCache(cacheKey: string, value: TreeMarketplaceCacheEntry) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(cacheKey, JSON.stringify(value));
  } catch {
    // Ignore storage write failures and keep the in-memory query cache.
  }
}

function loadGoogleMapsScript(apiKey: string) {
  if (typeof window === "undefined") {
    return Promise.resolve();
  }

  if (getGoogleWindow().google?.maps) {
    return Promise.resolve();
  }

  if (googleMapsLoaderPromise) {
    return googleMapsLoaderPromise;
  }

  googleMapsLoaderPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[data-google-maps-loader="true"]'
    );

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener("error", () => reject(new Error("Map failed to load.")), {
        once: true,
      });
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=weekly`;
    script.async = true;
    script.defer = true;
    script.dataset.googleMapsLoader = "true";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Map failed to load."));
    document.head.appendChild(script);
  });

  return googleMapsLoaderPromise;
}

async function getCurrentPosition() {
  if (typeof navigator === "undefined" || !navigator.geolocation) {
    return NEAREST_METRO;
  }

  return new Promise<LatLngLiteral>((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => resolve(NEAREST_METRO),
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  });
}

function getOriginLabel(results: GoogleMapsGeocoderResult[]) {
  const firstResult = results[0];

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

function normalizePlaceResult(
  place: GoogleMapsPlaceResult,
  origin: LatLngLiteral,
  addressFallback: string
): TreeMarketplacePlace | null {
  const latitude = place.location?.lat();
  const longitude = place.location?.lng();

  if (!place.id || !place.displayName || latitude === undefined || longitude === undefined) {
    return null;
  }

  const location = {
    lat: latitude,
    lng: longitude,
  };
  const distanceKm = getDistanceInKm(origin.lat, origin.lng, latitude, longitude);

  return {
    id: place.id,
    name: place.displayName,
    address: place.formattedAddress || addressFallback,
    distanceText:
      distanceKm < 1
        ? `${Math.max(100, Math.round(distanceKm * 1000))} m`
        : `${distanceKm.toFixed(distanceKm >= 10 ? 0 : 1)} km`,
    durationText: "",
    ratingValue: place.rating ?? null,
    ratingCount: place.userRatingCount ?? null,
    photoUrl: place.photos?.[0]?.getURI({ maxWidth: 800 }) || null,
    location,
    mapsUrl: place.googleMapsURI || null,
  };
}

function getPlaceExplorerUrl(place: TreeMarketplacePlace) {
  if (place.mapsUrl) {
    return place.mapsUrl;
  }

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${place.name} ${place.address}`
  )}`;
}

async function searchMarketplacePlaces(
  origin: LatLngLiteral,
  googleMaps: GoogleMapsNamespace,
  sectionConfig: MarketplaceSectionConfig
) {
  const placesLibrary = (await googleMaps.maps.importLibrary("places")) as GoogleMapsPlacesLibrary;
  const uniquePlaces = new Map<string, TreeMarketplacePlace>();

  for (const query of sectionConfig.searchQueries) {
    const result = await placesLibrary.Place.searchByText({
      textQuery: query,
      fields: [
        "id",
        "displayName",
        "formattedAddress",
        "location",
        "rating",
        "userRatingCount",
        "photos",
        "googleMapsURI",
      ],
      locationBias: {
        center: origin,
        radius: SEARCH_RADIUS_METERS,
      },
      maxResultCount: MAX_RESULTS,
      rankPreference: placesLibrary.SearchByTextRankPreference.DISTANCE,
      region: "IN",
      language: "en",
    });

    for (const place of result.places || []) {
      const normalizedPlace = normalizePlaceResult(place, origin, sectionConfig.addressFallback);

      if (!normalizedPlace || uniquePlaces.has(normalizedPlace.id)) {
        continue;
      }

      uniquePlaces.set(normalizedPlace.id, normalizedPlace);
    }

    if (uniquePlaces.size >= MAX_RESULTS) {
      break;
    }
  }

  return Array.from(uniquePlaces.values())
    .sort(
      (firstPlace, secondPlace) =>
        getDistanceInKm(origin.lat, origin.lng, firstPlace.location.lat, firstPlace.location.lng) -
        getDistanceInKm(origin.lat, origin.lng, secondPlace.location.lat, secondPlace.location.lng)
    )
    .slice(0, MAX_RESULTS);
}

async function fetchMarketplaceSnapshot(
  mapsApiKey: string,
  sectionConfig: MarketplaceSectionConfig,
  forceFresh = false
) {
  const cachedValue = readMarketplaceCache(sectionConfig.cacheKey);

  if (!mapsApiKey) {
    if (cachedValue) {
      return cachedValue;
    }

    throw new Error("Google Maps JavaScript key is missing for the live map.");
  }

  const currentPosition = await getCurrentPosition();

  if (cachedValue && !forceFresh) {
    const movedDistanceKm = getDistanceInKm(
      cachedValue.origin.lat,
      cachedValue.origin.lng,
      currentPosition.lat,
      currentPosition.lng
    );

    if (movedDistanceKm <= MOVE_THRESHOLD_KM) {
      return cachedValue;
    }
  }

  try {
    await loadGoogleMapsScript(mapsApiKey);

    const googleMaps = getGoogleWindow().google;

    if (!googleMaps?.maps?.importLibrary) {
      throw new Error("Google Maps libraries are unavailable.");
    }

    const geocodingLibrary = (await googleMaps.maps.importLibrary(
      "geocoding"
    )) as GoogleMapsGeocodingLibrary;
    const geocoder = new geocodingLibrary.Geocoder();
    const geocodeResult = await geocoder.geocode({ location: currentPosition });
    const sellerPlaces = await searchMarketplacePlaces(currentPosition, googleMaps, sectionConfig);

    const snapshot: TreeMarketplaceCacheEntry = {
      origin: currentPosition,
      originLabel: getOriginLabel(geocodeResult.results),
      places: sellerPlaces,
      savedAt: Date.now(),
    };

    writeMarketplaceCache(sectionConfig.cacheKey, snapshot);
    return snapshot;
  } catch (error) {
    if (cachedValue) {
      return cachedValue;
    }

    throw error;
  }
}

export function RecycleCreditGuide() {
  return (
    <section className="dashboard-surface rounded-2xl border border-gray-200 bg-white px-6 py-6 shadow-[0_28px_45px_-34px_rgba(15,23,42,0.25)] sm:px-8">
      <div className="max-w-3xl">
        <h2 className="dashboard-text-primary text-2xl font-semibold tracking-tight text-gray-900 sm:text-[2rem]">
          Recyclable items and credits
        </h2>
        <p className="dashboard-text-secondary mt-2 text-sm leading-6 text-gray-500">
          Estimated Eco Credit values for common recyclable items before you visit a nearby recycling centre.
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {RECYCLE_CREDIT_ITEMS.map((item) => (
          <article
            key={item.name}
            className="dashboard-surface-alt rounded-2xl border border-gray-200 bg-gray-50 p-5"
          >
            <p className="dashboard-text-secondary text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
              {item.name}
            </p>
            <div className="mt-4 flex items-end justify-between gap-3">
              <div>
                <p className="dashboard-text-primary text-2xl font-semibold text-gray-900">
                  {item.credits}
                </p>
                <p className="dashboard-text-secondary mt-1 text-sm text-gray-500">
                  {item.measure}
                </p>
              </div>
              <span className="rounded-full bg-[#ECF3FF] px-3 py-1 text-xs font-medium text-[#465FFF]">
                Credit guide
              </span>
            </div>
            <p className="dashboard-text-secondary mt-4 text-sm leading-6 text-gray-500">
              {item.detail}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default function TreeMarketplaceNewPlacesView({
  mapsApiKey,
  variant = "plants",
}: TreeMarketplaceNewPlacesViewProps) {
  const sectionConfig = MARKETPLACE_SECTION_CONFIG[variant];
  const showMap = variant === "plants";
  const cardsGridClassName = showMap
    ? "grid gap-5 md:grid-cols-2"
    : "grid gap-5 md:grid-cols-2 xl:grid-cols-4";
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<GoogleMapsMap | null>(null);
  const markerRefs = useRef<GoogleMapsMarker[]>([]);
  const originMarkerRef = useRef<GoogleMapsMarker | null>(null);
  const originRef = useRef<LatLngLiteral | null>(null);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [mapErrorMessage, setMapErrorMessage] = useState("");
  const forceFreshRef = useRef(false);
  const isHydrated = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const marketplaceCacheSnapshot = useSyncExternalStore(
    noopSubscribe,
    () => readMarketplaceCacheSnapshot(sectionConfig.cacheKey),
    () => null
  );
  const marketplaceCache = parseMarketplaceCacheSnapshot(marketplaceCacheSnapshot);

  const marketplaceQuery = useQuery({
    queryKey: [sectionConfig.queryKey],
    queryFn: async () => {
      const shouldForceFresh = forceFreshRef.current;
      forceFreshRef.current = false;
      return fetchMarketplaceSnapshot(mapsApiKey, sectionConfig, shouldForceFresh);
    },
    placeholderData: marketplaceCache,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    enabled: isHydrated && (Boolean(mapsApiKey) || Boolean(marketplaceCache)),
  });

  const marketplaceData = marketplaceQuery.data;
  const places = marketplaceData?.places ?? EMPTY_MARKETPLACE_PLACES;
  const originLabel = marketplaceData?.originLabel || "Finding your area";
  const errorMessage =
    marketplaceQuery.error instanceof Error
      ? marketplaceQuery.error.message
      : sectionConfig.errorMessage;
  const isMarketplaceFetching = marketplaceQuery.isFetching;
  const refetchMarketplace = marketplaceQuery.refetch;

  const selectedPlace = places.find((place) => place.id === selectedPlaceId) || null;

  useEffect(() => {
    originRef.current = marketplaceData?.origin || null;
  }, [marketplaceData]);

  useEffect(() => {
    if (selectedPlaceId && !places.some((place) => place.id === selectedPlaceId)) {
      setSelectedPlaceId(null);
    }
  }, [places, selectedPlaceId]);

  useEffect(() => {
    if (!marketplaceData || typeof navigator === "undefined" || !navigator.geolocation) {
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        if (isMarketplaceFetching) {
          return;
        }

        const nextPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        const movedDistanceKm = getDistanceInKm(
          marketplaceData.origin.lat,
          marketplaceData.origin.lng,
          nextPosition.lat,
          nextPosition.lng
        );

        if (movedDistanceKm > MOVE_THRESHOLD_KM) {
          void refetchMarketplace();
        }
      },
      () => undefined,
      {
        enableHighAccuracy: true,
        maximumAge: 60000,
        timeout: 10000,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [isMarketplaceFetching, marketplaceData, refetchMarketplace]);

  useEffect(() => {
    if (!showMap || !mapsApiKey || !mapRef.current || !originRef.current) {
      return;
    }

    let isActive = true;

    const syncMap = async () => {
      try {
        setMapErrorMessage("");
        await loadGoogleMapsScript(mapsApiKey);

        if (!isActive || !mapRef.current || !originRef.current) {
          return;
        }

        const googleMaps = getGoogleWindow().google;

        if (!googleMaps) {
          throw new Error("Map unavailable");
        }

        if (!mapInstanceRef.current) {
          mapInstanceRef.current = new googleMaps.maps.Map(mapRef.current, {
            center: originRef.current,
            zoom: 12,
            disableDefaultUI: true,
            zoomControl: true,
            clickableIcons: false,
            gestureHandling: "greedy",
          });
        }

        const map = mapInstanceRef.current;

        markerRefs.current.forEach((marker) => marker.setMap(null));
        markerRefs.current = [];

        places.forEach((place) => {
          const isSelected = selectedPlace?.id === place.id;
          const marker = new googleMaps.maps.Marker({
            map,
            position: place.location,
            title: place.name,
            icon: {
              path: googleMaps.maps.SymbolPath.CIRCLE,
              scale: isSelected ? 9 : 7,
              fillColor: isSelected ? "#465FFF" : "#7C3AED",
              fillOpacity: 1,
              strokeColor: "#FFFFFF",
              strokeWeight: 2,
            },
          });

          marker.addListener("click", () => {
            setSelectedPlaceId(place.id);
          });

          markerRefs.current.push(marker);
        });

        if (originMarkerRef.current) {
          originMarkerRef.current.setMap(null);
        }

        originMarkerRef.current = new googleMaps.maps.Marker({
          map,
          position: originRef.current,
          title: "Your location",
          icon: {
            path: googleMaps.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: "#111827",
            fillOpacity: 1,
            strokeColor: "#FFFFFF",
            strokeWeight: 2,
          },
        });

        if (places.length === 0) {
          map.setCenter(originRef.current);
          map.setZoom(13);
          return;
        }

        const bounds = new googleMaps.maps.LatLngBounds();
        bounds.extend(originRef.current);

        if (selectedPlace) {
          bounds.extend(selectedPlace.location);
        } else {
          places.forEach((place) => bounds.extend(place.location));
        }

        map.fitBounds(bounds, 72);
      } catch {
        if (isActive) {
          setMapErrorMessage("Unable to load the map right now.");
        }
      }
    };

    void syncMap();

    return () => {
      isActive = false;
    };
  }, [mapsApiKey, places, selectedPlace, showMap]);

  const renderImage = (place: TreeMarketplacePlace) => {
    if (place.photoUrl) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={place.photoUrl}
          alt={place.name}
          className="h-[200px] w-full object-cover"
          loading="lazy"
        />
      );
    }

    if (variant === "recycle") {
      return (
        <div className="flex h-[200px] w-full items-end bg-gradient-to-br from-[#d8ebda] via-[#eef7ef] to-white p-5">
          <div className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#2F6B3B]">
            {sectionConfig.placeholderLabel}
          </div>
        </div>
      );
    }

    return (
      <Image
        src={plantPreview}
        alt={place.name}
        className="h-[200px] w-full object-cover"
        priority={false}
      />
    );
  };

  const renderCards = () => {
    if (marketplaceQuery.isPending && !marketplaceData) {
      return Array.from({ length: 2 }).map((_, index) => (
        <div
          key={`loading-${index}`}
          className="dashboard-surface h-full rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_20px_40px_-32px_rgba(15,23,42,0.35)]"
        >
          <div className="space-y-5">
            <div className="h-[200px] animate-pulse rounded-2xl bg-gray-100" />
            <div className="space-y-3">
              <div className="h-4 w-28 animate-pulse rounded-full bg-gray-200" />
              <div className="h-8 w-56 animate-pulse rounded-full bg-gray-200" />
              <div className="h-4 w-full animate-pulse rounded-full bg-gray-100" />
              <div className="h-4 w-4/5 animate-pulse rounded-full bg-gray-100" />
              <div className="h-10 w-40 animate-pulse rounded-full bg-gray-100" />
            </div>
          </div>
        </div>
      ));
    }

    if (marketplaceQuery.isError && !marketplaceData) {
      return (
        <div className="dashboard-surface rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-10 text-sm text-gray-500">
          {errorMessage || sectionConfig.errorMessage}
        </div>
      );
    }

    if (places.length === 0) {
      return (
        <div className="dashboard-surface rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-10 text-sm text-gray-500">
          {sectionConfig.emptyMessage}
        </div>
      );
    }

    return places.map((place) => {
      const isSelected = showMap && selectedPlaceId === place.id;
      const explorerUrl = getPlaceExplorerUrl(place);

      return (
        <article
          key={place.id}
          className={`dashboard-surface h-full rounded-2xl border bg-white p-5 shadow-[0_20px_40px_-32px_rgba(15,23,42,0.35)] transition ${
            isSelected ? "border-[#465FFF]" : "border-gray-200"
          }`}
        >
          <div className="flex h-full flex-col gap-5">
            <div className="dashboard-surface-alt overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
              {renderImage(place)}
            </div>

            <div className="min-w-0 flex-1">
              <p className="dashboard-text-secondary text-xs font-medium tracking-[0.08em] text-gray-500">
                {place.address}
              </p>
              <h2
                className="dashboard-text-primary mt-2 min-h-[3.9rem] break-words text-[1.9rem] font-semibold leading-tight text-gray-900"
                style={CARD_TITLE_CLAMP_STYLE}
              >
                {place.name}
              </h2>
              <p className="dashboard-text-secondary mt-3 max-w-xl text-sm leading-7 text-gray-500">
                {place.ratingCount
                  ? `${place.ratingCount.toLocaleString("en-IN")} ${sectionConfig.ratingsDescriptionSuffix}`
                  : sectionConfig.fallbackDescription}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-5 text-sm text-gray-600">
                <span className="dashboard-text-secondary inline-flex items-center gap-2">
                  <MapPin size={14} className="text-[#465FFF]" />
                  {place.distanceText}
                </span>
                {place.durationText ? (
                  <span className="dashboard-text-secondary inline-flex items-center gap-2">
                    {place.durationText}
                  </span>
                ) : null}
                {place.ratingValue ? (
                  <span className="dashboard-text-secondary inline-flex items-center gap-2">
                    <Star size={14} className="fill-[#F59E0B] text-[#F59E0B]" />
                    {place.ratingValue.toFixed(1)}
                  </span>
                ) : null}
              </div>

              <a
                href={explorerUrl}
                target="_blank"
                rel="noreferrer"
                className={`mt-5 inline-flex min-w-[180px] items-center justify-center rounded-full border px-5 py-2.5 text-sm font-medium transition ${
                  isSelected
                    ? "border-[#465FFF] bg-[#465FFF] text-white"
                    : "border-gray-300 text-gray-700 hover:border-[#465FFF] hover:text-[#465FFF]"
                }`}
              >
                explore
              </a>
            </div>
          </div>
        </article>
      );
    });
  };

  return (
    <div className="space-y-6">
      <div className="dashboard-surface rounded-2xl border border-gray-200 bg-white px-6 py-6 shadow-[0_28px_45px_-34px_rgba(15,23,42,0.25)] sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="dashboard-text-primary text-3xl font-semibold tracking-tight text-gray-900 sm:text-[2.85rem] sm:leading-[1.05]">
              {sectionConfig.title}
            </h1>
            <p className="dashboard-text-secondary mt-2 text-sm text-gray-500">Near {originLabel}</p>
          </div>

          <button
            type="button"
            onClick={() => {
              forceFreshRef.current = true;
              void marketplaceQuery.refetch();
            }}
            className="inline-flex items-center justify-center rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:border-[#465FFF] hover:text-[#465FFF] disabled:cursor-not-allowed disabled:opacity-60"
            disabled={marketplaceQuery.isFetching}
          >
            {marketplaceQuery.isFetching ? "Refetching..." : "Refetch"}
          </button>
        </div>
      </div>

      <section className={showMap ? "grid gap-6 xl:items-start xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.95fr)]" : "space-y-5"}>
        <div className={cardsGridClassName}>{renderCards()}</div>

        {showMap ? (
          <div
            className={`dashboard-surface-alt relative h-[500px] overflow-hidden rounded-2xl border border-gray-200 ${sectionConfig.mapBackgroundClassName} shadow-[0_20px_40px_-32px_rgba(15,23,42,0.35)] xl:self-start`}
          >
            <div ref={mapRef} className="h-full w-full" />

            {marketplaceQuery.isPending && !marketplaceData && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white/35 backdrop-blur-[1px]">
                <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow">
                  <LoaderCircle size={16} className="animate-spin text-[#465FFF]" />
                  Loading
                </span>
              </div>
            )}

            {!mapsApiKey && (
              <div className="absolute inset-0 flex items-center justify-center p-6 text-center text-sm text-gray-600">
                Google Maps JavaScript key is missing for the live map.
              </div>
            )}

            {marketplaceQuery.isError && !marketplaceData && (
              <div className="absolute inset-0 flex items-center justify-center p-6 text-center text-sm text-gray-600">
                {errorMessage}
              </div>
            )}

            {!marketplaceQuery.isError && mapErrorMessage && (
              <div className="absolute inset-0 flex items-center justify-center p-6 text-center text-sm text-gray-600">
                {mapErrorMessage}
              </div>
            )}
          </div>
        ) : null}
      </section>
    </div>
  );
}
