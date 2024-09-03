// src/components/MapComponent.tsx
import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Exchange } from "./types/exchanges";

const countryCoordinates: Record<string, [number, number]> = {
  Japan: [35.6895, 139.6917],
  "Hong Kong": [22.3193, 114.1694],
  Turkey: [39.9334, 32.8597],
  Singapore: [1.3521, 103.8198],
  US: [37.0902, -95.7129],
  Australia: [-25.2744, 133.7751],
  Russia: [61.524, 105.3188],
  China: [35.8617, 104.1954],
  // Add more countries as needed
};

interface UpdateMapViewProps {
  exchanges: Exchange[];
}

const UpdateMapView: React.FC<UpdateMapViewProps> = ({ exchanges }) => {
  const map = useMap();

  useEffect(() => {
    if (exchanges.length > 0) {
      const bounds = L.latLngBounds(
        exchanges
          .map((exchange) => {
            const coords = countryCoordinates[exchange.country];
            return coords ? L.latLng(coords) : null;
          })
          .filter(Boolean) as L.LatLng[]
      );

      map.fitBounds(bounds);
    }
  }, [exchanges, map]);

  return null;
};

const MapComponent: React.FC<{ exchanges: Exchange[]; filter: string }> = ({
  exchanges,
  filter,
}) => {
  const filteredExchanges = exchanges.filter(
    (exchange) => filter === "" || exchange.country === filter
  );

  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <UpdateMapView exchanges={filteredExchanges} />
      {filteredExchanges.map((exchange) => {
        const coords = countryCoordinates[exchange.country];
        if (coords) {
          return (
            <Marker key={exchange.id} position={coords}>
              <Popup>
                <strong>{exchange.name}</strong>
                <br />
                Trading Volume: ${exchange.volume_usd.toLocaleString()}
                <br />
                Country: {exchange.country}
              </Popup>
            </Marker>
          );
        } else {
          console.warn(`No coordinates for ${exchange.country}`);
          return null;
        }
      })}
    </MapContainer>
  );
};

export default MapComponent;
