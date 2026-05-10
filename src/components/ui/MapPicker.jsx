import { useEffect, useRef } from 'react';

export function MapPicker({ lat, lng, onLocationChange }) {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!window.L) return;

    // Initialize map if not already done
    if (!mapInstanceRef.current) {
      const initialLat = lat || 19.0760;
      const initialLng = lng || 72.8777;

      mapInstanceRef.current = window.L.map(mapRef.current).setView([initialLat, initialLng], 13);

      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapInstanceRef.current);

      markerRef.current = window.L.marker([initialLat, initialLng], {
        draggable: true
      }).addTo(mapInstanceRef.current);

      markerRef.current.on('dragend', function (event) {
        const marker = event.target;
        const position = marker.getLatLng();
        onLocationChange(position.lat, position.lng);
      });

      mapInstanceRef.current.on('click', function (e) {
        markerRef.current.setLatLng(e.latlng);
        onLocationChange(e.latlng.lat, e.latlng.lng);
      });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update marker position if lat/lng props change externally (e.g. from GPS)
  useEffect(() => {
    if (mapInstanceRef.current && markerRef.current && lat && lng) {
      const currentPos = markerRef.current.getLatLng();
      if (currentPos.lat !== lat || currentPos.lng !== lng) {
        markerRef.current.setLatLng([lat, lng]);
        mapInstanceRef.current.setView([lat, lng], 15);
      }
    }
  }, [lat, lng]);

  return (
    <div className="w-full h-64 rounded-2xl overflow-hidden shadow-inner border border-brand/10 relative z-10">
      <div ref={mapRef} className="w-full h-full" />
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full border border-brand/10 z-[1000]">
        <p className="text-[10px] font-bold text-brand uppercase tracking-wider">Drag pin to set location</p>
      </div>
    </div>
  );
}
