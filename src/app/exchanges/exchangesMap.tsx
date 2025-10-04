import React, { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Exchange } from "./types/exchanges";

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

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


const MapComponent: React.FC<{ exchanges: Exchange[]; filter: string }> = ({
  exchanges,
  filter,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  
  // Memoize filtered exchanges to prevent unnecessary re-renders
  const filteredExchanges = useMemo(() => {
    return exchanges.filter(
      (exchange) => filter === "" || exchange.country === filter
    );
  }, [exchanges, filter]);

  // Initialize map once
  useEffect(() => {
    if (containerRef.current && !mapInstanceRef.current) {
      try {
        const map = L.map(containerRef.current, {
          center: [20, 0],
          zoom: 2,
          scrollWheelZoom: false
        });
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        
        mapInstanceRef.current = map;
      } catch (error) {
        console.error('Error creating map:', error);
      }
    }

    // Cleanup on unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers when exchanges or filter change
  useEffect(() => {
    if (mapInstanceRef.current) {
      // Clear existing markers
      mapInstanceRef.current.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          mapInstanceRef.current?.removeLayer(layer);
        }
      });
      
      // Add new markers
      const bounds = L.latLngBounds([]);
      
      filteredExchanges.forEach((exchange) => {
        const coords = countryCoordinates[exchange.country];
        if (coords && mapInstanceRef.current) {
          try {
            const marker = L.marker(coords, { icon: customIcon })
              .bindPopup(`
                <strong>${exchange.name}</strong><br/>
                Trading Volume: $${exchange.volume_usd.toLocaleString()}<br/>
                Country: ${exchange.country}
              `);
            
            marker.addTo(mapInstanceRef.current);
            bounds.extend(coords);
          } catch (error) {
            console.warn(`Failed to add marker for ${exchange.name}:`, error);
          }
        }
      });
      
      // Fit bounds if we have markers
      if (filteredExchanges.length > 0 && mapInstanceRef.current) {
        mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
        if (mapInstanceRef.current.getZoom() > 4) {
          mapInstanceRef.current.setZoom(4);
        }
      }
    }
  }, [filteredExchanges]);

  return (
    <div ref={containerRef} style={{ height: "400px", width: "100%" }} />
  );
};

export default MapComponent;