import React, { useState } from 'react';
import { MapContainer, TileLayer, Circle, useMapEvents } from 'react-leaflet';
import { LatLng } from 'leaflet';
import 'leaflet/dist/leaflet.css';

type GeofenceMapProps = {
  center: [number, number];
  radius: number;
  onGeofenceChange: (center: [number, number], radius: number) => void;
};

function DraggableCircle({ center, radius, onChange }: {
  center: [number, number];
  radius: number;
  onChange: (center: [number, number], radius: number) => void;
}) {
  const [position, setPosition] = useState(center);
  
  const map = useMapEvents({
    click(e) {
      const newPos: [number, number] = [e.latlng.lat, e.latlng.lng];
      setPosition(newPos);
      onChange(newPos, radius);
    },
  });

  return (
    <Circle
      center={position}
      radius={radius}
      pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.2 }}
    />
  );
}

export function GeofenceMap({ center, radius, onGeofenceChange }: GeofenceMapProps) {
  return (
    <div className="h-[400px] w-full rounded-lg overflow-hidden">
      <MapContainer
        center={center}
        zoom={15}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <DraggableCircle
          center={center}
          radius={radius}
          onChange={onGeofenceChange}
        />
      </MapContainer>
    </div>
  );
}