"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { LoaderCircle, MapPin, Star } from "lucide-react";
import { NEAREST_METRO } from "@/lib/geoUtils";
import plantPreview from "@/images/image.png";
import type {
  LatLngLiteral,
  TreeMarketplacePlace,
  TreeMarketplaceResponse,
  TreeMarketplaceRouteResponse,
} from "@/lib/treeMarketplace";

type LoadState = "loading" | "ready" | "error";

interface GoogleMapsMap {
  fitBounds(bounds: GoogleMapsLatLngBounds, padding?: number): void;
}

interface GoogleMapsMarker {
  setMap(map: GoogleMapsMap | null): void;
  addListener(eventName: string, handler: () => void): void;
}

interface GoogleMapsPolyline {
  setMap(map: GoogleMapsMap | null): void;
}

interface GoogleMapsLatLngBounds {
  extend(point: LatLngLiteral): void;
}

interface GoogleMapsNamespace {
  maps: {
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
    Polyline: new (options: {
      path: LatLngLiteral[];
      geodesic: boolean;
      strokeColor: string;
      strokeOpacity: number;
      strokeWeight: number;
    }) => GoogleMapsPolyline;
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

let googleMapsLoaderPromise: Promise<void> | null = null;

function getGoogleWindow() {
  return window as GoogleWindow;
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

function decodePolyline(encodedPolyline: string) {
  let index = 0;
  let latitude = 0;
  let longitude = 0;
  const coordinates: LatLngLiteral[] = [];

  while (index < encodedPolyline.length) {
    let shift = 0;
    let result = 0;
    let byte = 0;

    do {
      byte = encodedPolyline.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    latitude += (result & 1) !== 0 ? ~(result >> 1) : result >> 1;

    shift = 0;
    result = 0;

    do {
      byte = encodedPolyline.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    longitude += (result & 1) !== 0 ? ~(result >> 1) : result >> 1;

    coordinates.push({
      lat: latitude / 1e5,
      lng: longitude / 1e5,
    });
  }

  return coordinates;
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

interface TreeMarketplaceViewProps {
  mapsApiKey: string;
}

export default function TreeMarketplaceView({ mapsApiKey }: TreeMarketplaceViewProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<GoogleMapsMap | null>(null);
  const markerRefs = useRef<GoogleMapsMarker[]>([]);
  const originMarkerRef = useRef<GoogleMapsMarker | null>(null);
  const polylineRef = useRef<GoogleMapsPolyline | null>(null);
  const originRef = useRef<LatLngLiteral | null>(null);
  const [places, setPlaces] = useState<TreeMarketplacePlace[]>([]);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [originLabel, setOriginLabel] = useState("Finding your area");
  const [status, setStatus] = useState<LoadState>("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [routeData, setRouteData] = useState<TreeMarketplaceRouteResponse | null>(null);
  const [routeLoading, setRouteLoading] = useState(false);

  const selectedPlace = places.find((place) => place.id === selectedPlaceId) || null;

  useEffect(() => {
    let isActive = true;

    const loadPlaces = async () => {
      setStatus("loading");
      setErrorMessage("");

      try {
        const origin = await getCurrentPosition();

        if (!isActive) {
          return;
        }

        originRef.current = origin;

        const response = await fetch(
          `/api/marketplace/nearby?lat=${origin.lat}&lng=${origin.lng}`,
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error("Unable to load nearby places.");
        }

        const data = (await response.json()) as TreeMarketplaceResponse;

        if (!isActive) {
          return;
        }

        setPlaces(data.places);
        setOriginLabel(data.originLabel || "Near you");
        setSelectedPlaceId(data.places[0]?.id || null);
        setStatus("ready");
      } catch {
        if (!isActive) {
          return;
        }

        setStatus("error");
        setErrorMessage("Unable to load nearby nurseries right now.");
      }
    };

    void loadPlaces();

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedPlace || !originRef.current) {
      setRouteData(null);
      return;
    }

    let isActive = true;
    const controller = new AbortController();

    const loadRoute = async () => {
      setRouteLoading(true);

      try {
        const origin = originRef.current as LatLngLiteral;
        const response = await fetch(
          `/api/marketplace/route?originLat=${origin.lat}&originLng=${origin.lng}&destinationLat=${selectedPlace.location.lat}&destinationLng=${selectedPlace.location.lng}`,
          {
            cache: "no-store",
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error("Unable to load route.");
        }

        const data = (await response.json()) as TreeMarketplaceRouteResponse;

        if (!isActive) {
          return;
        }

        setRouteData(data);
      } catch (error) {
        if (!isActive) {
          return;
        }

        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setRouteData(null);
      } finally {
        if (isActive) {
          setRouteLoading(false);
        }
      }
    };

    void loadRoute();

    return () => {
      isActive = false;
      controller.abort();
    };
  }, [selectedPlace]);

  useEffect(() => {
    if (!mapsApiKey || !mapRef.current || places.length === 0 || !originRef.current) {
      return;
    }

    let isActive = true;

    const syncMap = async () => {
      try {
        await loadGoogleMapsScript(mapsApiKey);

        if (!isActive || !mapRef.current || !originRef.current) {
          return;
        }

        const googleWindow = getGoogleWindow();
        const googleMaps = googleWindow.google;

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

        if (polylineRef.current) {
          polylineRef.current.setMap(null);
          polylineRef.current = null;
        }

        const bounds = new googleMaps.maps.LatLngBounds();
        bounds.extend(originRef.current);

        if (routeData?.encodedPolyline) {
          const decodedPath = decodePolyline(routeData.encodedPolyline);
          polylineRef.current = new googleMaps.maps.Polyline({
            path: decodedPath,
            geodesic: true,
            strokeColor: "#465FFF",
            strokeOpacity: 0.9,
            strokeWeight: 4,
          });
          polylineRef.current.setMap(map);
          decodedPath.forEach((point) => bounds.extend(point));
        } else if (selectedPlace) {
          bounds.extend(selectedPlace.location);
        } else {
          places.forEach((place) => bounds.extend(place.location));
        }

        map.fitBounds(bounds, 72);
      } catch {
        if (isActive) {
          setErrorMessage("Map could not be loaded.");
        }
      }
    };

    void syncMap();

    return () => {
      isActive = false;
    };
  }, [mapsApiKey, places, routeData, selectedPlace]);

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
    if (status === "loading") {
      return Array.from({ length: 2 }).map((_, index) => (
        <div
          key={`loading-${index}`}
          className="dashboard-surface rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_20px_40px_-32px_rgba(15,23,42,0.35)]"
        >
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_220px] lg:items-center">
            <div className="space-y-3">
              <div className="h-4 w-28 animate-pulse rounded-full bg-gray-200" />
              <div className="h-8 w-56 animate-pulse rounded-full bg-gray-200" />
              <div className="h-4 w-full animate-pulse rounded-full bg-gray-100" />
              <div className="h-4 w-4/5 animate-pulse rounded-full bg-gray-100" />
              <div className="h-10 w-40 animate-pulse rounded-full bg-gray-100" />
            </div>
            <div className="h-[200px] animate-pulse rounded-2xl bg-gray-100" />
          </div>
        </div>
      ));
    }

    if (places.length === 0) {
      return (
        <div className="dashboard-surface rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-10 text-sm text-gray-500">
          No nearby plant nurseries were found for this location.
        </div>
      );
    }

    return places.map((place) => {
      const isSelected = selectedPlaceId === place.id;
      const visibleDistance =
        isSelected && routeData?.distanceText ? routeData.distanceText : place.distanceText;
      const visibleDuration =
        isSelected && routeData?.durationText ? routeData.durationText : place.durationText;

      return (
        <article
          key={place.id}
          className={`dashboard-surface rounded-2xl border bg-white p-5 shadow-[0_20px_40px_-32px_rgba(15,23,42,0.35)] transition ${
            isSelected ? "border-[#465FFF]" : "border-gray-200"
          }`}
        >
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_220px] lg:items-center">
            <div className="min-w-0">
              <p className="dashboard-text-secondary text-xs font-medium tracking-[0.08em] text-gray-500">
                {place.address}
              </p>
              <h2 className="dashboard-text-primary mt-2 text-[1.9rem] font-semibold leading-tight text-gray-900">
                {place.name}
              </h2>
              <p className="dashboard-text-secondary mt-3 max-w-xl text-sm leading-7 text-gray-500">
                {place.ratingCount
                  ? `${place.ratingCount.toLocaleString("en-IN")} people rated this place on Google.`
                  : "Nearby plant nursery available for exploration."}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-5 text-sm text-gray-600">
                <span className="dashboard-text-secondary inline-flex items-center gap-2">
                  <MapPin size={14} className="text-[#465FFF]" />
                  {visibleDistance}
                </span>
                {visibleDuration ? (
                  <span className="dashboard-text-secondary inline-flex items-center gap-2">
                    {visibleDuration}
                  </span>
                ) : null}
                {place.ratingValue ? (
                  <span className="dashboard-text-secondary inline-flex items-center gap-2">
                    <Star size={14} className="fill-[#F59E0B] text-[#F59E0B]" />
                    {place.ratingValue.toFixed(1)}
                  </span>
                ) : null}
              </div>

              <button
                type="button"
                onClick={() => setSelectedPlaceId(place.id)}
                className={`mt-5 inline-flex min-w-[180px] items-center justify-center rounded-full border px-5 py-2.5 text-sm font-medium transition ${
                  isSelected
                    ? "border-[#465FFF] bg-[#465FFF] text-white"
                    : "border-gray-300 text-gray-700 hover:border-[#465FFF] hover:text-[#465FFF]"
                }`}
              >
                explore
              </button>
            </div>

            <div className="dashboard-surface-alt overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
              {renderImage(place)}
            </div>
          </div>
        </article>
      );
    });
  };

  return (
    <div className="space-y-6">
      <div className="dashboard-surface rounded-2xl border border-gray-200 bg-white px-6 py-6 shadow-[0_28px_45px_-34px_rgba(15,23,42,0.25)] sm:px-8">
        <h1 className="dashboard-text-primary text-3xl font-semibold tracking-tight text-gray-900 sm:text-[2.85rem] sm:leading-[1.05]">
          Buy tree and plant
        </h1>
        <p className="dashboard-text-secondary mt-2 text-sm text-gray-500">Near {originLabel}</p>
      </div>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.95fr)]">
        <div className="space-y-5">{renderCards()}</div>

        <div className="dashboard-surface-alt relative min-h-[540px] overflow-hidden rounded-2xl border border-gray-200 bg-[#ede7f8] shadow-[0_20px_40px_-32px_rgba(15,23,42,0.35)]">
          <div ref={mapRef} className="h-full min-h-[540px] w-full" />

          {(status === "loading" || routeLoading) && (
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

          {status === "error" && (
            <div className="absolute inset-0 flex items-center justify-center p-6 text-center text-sm text-gray-600">
              {errorMessage}
            </div>
          )}

          {selectedPlace && routeData && status === "ready" && (
            <div className="dashboard-surface absolute bottom-4 left-4 right-4 rounded-2xl border border-gray-200 bg-white/95 px-4 py-3 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.35)] backdrop-blur">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="dashboard-text-primary truncate text-sm font-semibold text-gray-900">
                    {selectedPlace.name}
                  </p>
                  <p className="dashboard-text-secondary truncate text-xs text-gray-500">
                    {selectedPlace.address}
                  </p>
                </div>
                <div className="text-right text-xs text-gray-500">
                  <p>{routeData.distanceText}</p>
                  <p>{routeData.durationText}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
