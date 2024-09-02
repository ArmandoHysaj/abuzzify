// src/app/crypto-exchange-overview/ExchangeMap.tsx
import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Exchange } from "./types"; // Import the Exchange type

interface ExchangeMapProps {
  exchanges: Exchange[];
}

const ExchangeMap: React.FC<ExchangeMapProps> = ({ exchanges }) => {
  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      {exchanges
        .filter(
          (exchange) =>
            exchange.latitude !== undefined && exchange.longitude !== undefined
        )
        .map((exchange) => (
          <Marker
            key={exchange.id}
            position={[exchange.latitude!, exchange.longitude!]}
          >
            <Popup>
              <strong>{exchange.name}</strong>
              <br />
              Country: {exchange.country}
              <br />
              Volume: ${exchange.volume_usd.toLocaleString()}
            </Popup>
          </Marker>
        ))}
    </MapContainer>
  );
};

export default ExchangeMap;
