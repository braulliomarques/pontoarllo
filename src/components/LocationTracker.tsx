import React, { useState, useEffect } from 'react';
import { MapPin, AlertCircle } from 'lucide-react';
import * as turf from '@turf/turf';

type LocationTrackerProps = {
  allowedArea?: {
    center: [number, number];
    radius: number;
  };
  onLocationUpdate: (location: GeolocationPosition) => void;
};

export function LocationTracker({ allowedArea, onLocationUpdate }: LocationTrackerProps) {
  const [currentLocation, setCurrentLocation] = useState<GeolocationPosition | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isWithinArea, setIsWithinArea] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocalização não é suportada pelo seu navegador');
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setCurrentLocation(position);
        onLocationUpdate(position);

        if (allowedArea) {
          const point = turf.point([
            position.coords.longitude,
            position.coords.latitude
          ]);
          
          const center = turf.point([
            allowedArea.center[1],
            allowedArea.center[0]
          ]);
          
          const distance = turf.distance(point, center, { units: 'meters' });
          setIsWithinArea(distance <= allowedArea.radius);
        }
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setError('Permissão de localização negada');
            break;
          case error.POSITION_UNAVAILABLE:
            setError('Localização indisponível');
            break;
          case error.TIMEOUT:
            setError('Tempo de requisição expirado');
            break;
          default:
            setError('Erro ao obter localização');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [allowedArea, onLocationUpdate]);

  if (error) {
    return (
      <div className="p-4 bg-red-50 rounded-lg flex items-center text-red-700">
        <AlertCircle className="h-5 w-5 mr-2" />
        <span>{error}</span>
      </div>
    );
  }

  if (!currentLocation) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg flex items-center">
        <MapPin className="h-5 w-5 mr-2 text-gray-400 animate-pulse" />
        <span>Obtendo localização...</span>
      </div>
    );
  }

  return (
    <div className={`p-4 rounded-lg flex items-center ${
      isWithinArea ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
    }`}>
      <MapPin className="h-5 w-5 mr-2" />
      <div>
        <p className="font-medium">
          {isWithinArea ? 'Localização válida' : 'Fora da área permitida'}
        </p>
        <p className="text-sm">
          Lat: {currentLocation.coords.latitude.toFixed(6)}, 
          Lng: {currentLocation.coords.longitude.toFixed(6)}
        </p>
      </div>
    </div>
  );
}