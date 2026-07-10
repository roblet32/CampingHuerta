"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Workaround para iconos de Leaflet en Next.js
// @ts-expect-error Leaflet keeps this private field in its default icon prototype.
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

interface LeafletMapProps {
    center?: [number, number];
    zoom?: number;
    address?: string;
    markerLabel?: string;
}

export default function LeafletMap({
    center = [21.389516529698966, -99.58461802291626], // Coordenadas de ejemplo (Querétaro, México) - Ajustar según sea necesario
    zoom = 16,
    markerLabel = "¡Estamos aquí! CampingHuerta"
}: LeafletMapProps) {

    useEffect(() => {
        // Asegurar que Leaflet se inicialice correctamente en el cliente
        window.dispatchEvent(new Event("resize"));
    }, []);

    return (
        <div className="w-full h-full min-h-[400px] rounded-3xl overflow-hidden shadow-inner border border-slate-200">
            <MapContainer
                center={center}
                zoom={zoom}
                scrollWheelZoom={false}
                className="w-full h-full z-10"
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={center}>
                    <Popup>
                        <div className="text-center p-1">
                            <strong className="text-emerald-700 block mb-1">CampingHuerta</strong>
                            <p className="text-xs text-slate-600 m-0">{markerLabel}</p>
                        </div>
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
}
