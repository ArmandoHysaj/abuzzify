import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Exchange } from "./types/exchanges";
// const markerImg = require("./marker-icon-2x.png").default;

const countryCoordinates: Record<string, [number, number]> = {
  Japan: [35.6895, 139.6917],
  "Hong Kong": [22.3193, 114.1694],
  Turkey: [39.9334, 32.8597],
  Singapore: [1.3521, 103.8198],
  US: [37.0902, -95.7129],
  Australia: [-25.2744, 133.7751],
  Russia: [61.524, 105.3188],
  China: [35.8617, 104.1954],
};

const customIcon = L.icon({
  iconUrl:
    "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48IS0tIFVwbG9hZGVkIHRvOiBTVkcgUmVwbywgd3d3LnN2Z3JlcG8uY29tLCBHZW5lcmF0b3I6IFNWRyBSZXBvIE1peGVyIFRvb2xzIC0tPgo8c3ZnIHdpZHRoPSI4MDBweCIgaGVpZ2h0PSI4MDBweCIgdmlld0JveD0iMCAwIDI0IDI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiPjxwYXRoIGZpbGw9IiMwMDAwMDAiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTExLjI5MSAyMS43MDYgMTIgMjFsLS43MDkuNzA2ek0xMiAyMWwuNzA4LjcwNmExIDEgMCAwIDEtMS40MTcgMGwtLjAwNi0uMDA3LS4wMTctLjAxNy0uMDYyLS4wNjNhNDcuNzA4IDQ3LjcwOCAwIDAgMS0xLjA0LTEuMTA2IDQ5LjU2MiA0OS41NjIgMCAwIDEtMi40NTYtMi45MDhjLS44OTItMS4xNS0xLjgwNC0yLjQ1LTIuNDk3LTMuNzM0QzQuNTM1IDEyLjYxMiA0IDExLjI0OCA0IDEwYzAtNC41MzkgMy41OTItOCA4LTggNC40MDggMCA4IDMuNDYxIDggOCAwIDEuMjQ4LS41MzUgMi42MTItMS4yMTMgMy44Ny0uNjkzIDEuMjg2LTEuNjA0IDIuNTg1LTIuNDk3IDMuNzM1YTQ5LjU4MyA0OS41ODMgMCAwIDEtMy40OTYgNC4wMTRsLS4wNjIuMDYzLS4wMTcuMDE3LS4wMDYuMDA2TDEyIDIxem0wLThhMyAzIDAgMSAwIDAtNiAzIDMgMCAwIDAgMCA2eiIgY2xpcC1ydWxlPSJldmVub2RkIi8+PC9zdmc+",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

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

      const padding: [number, number] = [50, 50];
      map.fitBounds(bounds, { padding });

      if (map.getZoom() > 4) {
        map.setZoom(4);
      }
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
            <Marker key={exchange.id} position={coords} icon={customIcon}>
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
