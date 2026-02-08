"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { TouristResource } from "@/types";

// Fix for default marker icons in Leaflet with Next.js
const iconUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png";
const iconRetinaUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png";
const shadowUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png";

const customIcon = L.icon({
    iconUrl,
    iconRetinaUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41],
});

interface MapViewProps {
    resources: TouristResource[];
    selectedResourceId: string | null;
    onSelectResource: (id: string) => void;
    center?: [number, number];
}

// Component to handle map view updates
function MapUpdater({ center, resources }: { center?: [number, number], resources: TouristResource[] }) {
    const map = useMap();

    useEffect(() => {
        if (center) {
            map.setView(center, 13);
        } else if (resources.length > 0) {
            // Fit bounds to show all markers
            const bounds = L.latLngBounds(resources.map(r => [r.location.lat, r.location.lng]));
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [center, resources, map]);

    return null;
}

export default function MapView({
    resources,
    selectedResourceId,
    onSelectResource,
    center = [35.6895, 139.6917], // Default to Tokyo
}: MapViewProps) {
    // Use state to ensure client-side rendering only
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <div className="h-full w-full bg-muted animate-pulse rounded-lg" />;

    return (
        <div className="h-full w-full rounded-lg overflow-hidden border">
            <MapContainer
                center={center}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
                scrollWheelZoom={true}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapUpdater center={resources.length === 0 ? center : undefined} resources={resources} />

                {resources.map((resource) => (
                    <Marker
                        key={resource.id}
                        position={[resource.location.lat, resource.location.lng]}
                        icon={customIcon}
                        eventHandlers={{
                            click: () => onSelectResource(resource.id),
                        }}
                    >
                        <Popup>
                            <strong>{resource.name}</strong>
                            <br />
                            W: {resource.scores.western} | A: {resource.scores.asian}
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
