import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";
import type { Sitio } from "@/lib/riqsiy-data";

declare global {
  interface Window {
    google?: {
      maps: {
        Map: new (element: HTMLElement, options: Record<string, unknown>) => GoogleMap;
        Marker: new (options: Record<string, unknown>) => GoogleMarker;
        LatLngBounds: new () => GoogleBounds;
      };
    };
    initRiqsiyHeritageMap?: () => void;
  }
}

type GoogleMap = {
  fitBounds: (bounds: GoogleBounds, padding?: number) => void;
  panTo: (position: { lat: number; lng: number }) => void;
  setZoom: (zoom: number) => void;
};

type GoogleMarker = {
  addListener: (event: string, callback: () => void) => void;
  setMap: (map: GoogleMap | null) => void;
};

type GoogleBounds = {
  extend: (position: { lat: number; lng: number }) => void;
};

interface GoogleHeritageMapProps {
  sitios: Sitio[];
  activo: string | null;
  onSelect: (slug: string) => void;
}

const MAP_SCRIPT_ID = "riqsiy-google-maps";

export function GoogleHeritageMap({ sitios, activo, onSelect }: GoogleHeritageMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<GoogleMap | null>(null);
  const markersRef = useRef<GoogleMarker[]>([]);
  const [estado, setEstado] = useState<"cargando" | "listo" | "error">("cargando");

  useEffect(() => {
    const apiKey = import.meta.env["VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY"];
    const channel = import.meta.env["VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_TRACKING_ID"];
    if (!apiKey) {
      setEstado("error");
      return;
    }

    const initialize = () => {
      if (!containerRef.current || !window.google?.maps) return;
      mapRef.current = new window.google.maps.Map(containerRef.current, {
        center: { lat: -13.45, lng: -71.98 },
        zoom: 9,
        mapTypeId: "terrain",
        clickableIcons: false,
        fullscreenControl: true,
        mapTypeControl: true,
        streetViewControl: false,
        styles: [{ featureType: "poi", stylers: [{ visibility: "off" }] }],
      });
      setEstado("listo");
    };

    if (window.google?.maps) {
      initialize();
      return;
    }

    window.initRiqsiyHeritageMap = initialize;
    if (!document.getElementById(MAP_SCRIPT_ID)) {
      const script = document.createElement("script");
      script.id = MAP_SCRIPT_ID;
      script.async = true;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&loading=async&callback=initRiqsiyHeritageMap&channel=${encodeURIComponent(channel ?? "riqsiy")}`;
      script.onerror = () => setEstado("error");
      document.head.appendChild(script);
    }

    return () => {
      delete window.initRiqsiyHeritageMap;
    };
  }, []);

  useEffect(() => {
    const maps = window.google?.maps;
    const map = mapRef.current;
    if (estado !== "listo" || !maps || !map) return;

    markersRef.current.forEach((marker) => marker.setMap(null));
    const bounds = new maps.LatLngBounds();
    const sitiosUbicables = sitios.filter((sitio) => sitio.coordenadas);
    markersRef.current = sitiosUbicables.map((sitio) => {
      const coordenadas = sitio.coordenadas;
      if (!coordenadas) throw new Error("Coordenadas no disponibles");
      const position = { lat: coordenadas.lat, lng: coordenadas.lng };
      bounds.extend(position);
      const marker = new maps.Marker({
        map,
        position,
        title: sitio.nombre,
        label: { text: sitio.nombre.slice(0, 1), color: "#ffffff", fontWeight: "700" },
      });
      marker.addListener("click", () => onSelect(sitio.slug));
      return marker;
    });
    if (sitiosUbicables.length > 1) map.fitBounds(bounds, 52);
    const unico = sitiosUbicables[0];
    if (sitiosUbicables.length === 1 && unico?.coordenadas) {
      map.panTo({ lat: unico.coordenadas.lat, lng: unico.coordenadas.lng });
      map.setZoom(14);
    }
  }, [estado, sitios, onSelect]);

  useEffect(() => {
    const map = mapRef.current;
    const sitio = sitios.find((item) => item.slug === activo);
    if (!map || !sitio?.coordenadas) return;
    map.panTo({ lat: sitio.coordenadas.lat, lng: sitio.coordenadas.lng });
    map.setZoom(14);
  }, [activo, sitios]);

  return (
    <div className="relative min-h-[420px] overflow-hidden rounded-lg border border-border bg-secondary/50 lg:min-h-[560px]">
      <div ref={containerRef} className="absolute inset-0" aria-label="Mapa de lugares patrimoniales del Cusco" />
      {estado === "cargando" && (
        <div className="absolute inset-0 grid place-items-center bg-secondary text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4" /> Cargando mapa patrimonial…</span>
        </div>
      )}
      {estado === "error" && (
        <div className="absolute inset-0 grid place-items-center bg-secondary px-6 text-center text-sm text-muted-foreground">
          El mapa no pudo cargarse. Puedes consultar los lugares en la lista lateral.
        </div>
      )}
    </div>
  );
}