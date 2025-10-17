'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Property } from '@/lib/properties';

// Fix for default marker icon
const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${color}; width: 25px; height: 40px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); position: relative;">
      <div style="position: absolute; width: 14px; height: 14px; border-radius: 50%; background: white; top: 5px; left: 5px;"></div>
    </div>`,
    iconSize: [25, 40],
    iconAnchor: [12, 40],
    popupAnchor: [0, -40],
  });
};

const availableIcon = createCustomIcon('#00ff00');
const rentedIcon = createCustomIcon('#0033ff');

interface MapProps {
  properties: Property[];
  selectedProperty?: Property | null;
}

export default function Map({ properties, selectedProperty }: MapProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div style={{ width: '100%', height: '600px', background: '#e5e7eb' }}>Loading map...</div>;
  }

  const center: [number, number] = selectedProperty?.lat && selectedProperty?.lng
    ? [selectedProperty.lat, selectedProperty.lng]
    : [39.7028, -75.1118]; // Glassboro, NJ

  return (
    <MapContainer
      center={center}
      zoom={14}
      style={{ width: '100%', height: '600px' }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {properties.map((property) => {
        if (!property.lat || !property.lng) return null;

        return (
          <Marker
            key={property.id}
            position={[property.lat, property.lng]}
            icon={property.status === 'available' ? availableIcon : rentedIcon}
          >
            <Popup>
              <div style={{ padding: '8px' }}>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 'bold' }}>
                  {property.title}
                </h3>
                <p style={{ margin: '4px 0', fontSize: '14px' }}>{property.address}</p>
                {property.rent > 0 && (
                  <p style={{ margin: '4px 0', fontSize: '14px', fontWeight: 'bold', color: '#00ff00' }}>
                    ${property.rent.toLocaleString()}/mo
                  </p>
                )}
                <p style={{ margin: '4px 0', fontSize: '14px' }}>
                  {property.beds} Bedrooms {property.baths} Bathrooms
                </p>
                <p style={{
                  margin: '8px 0 0 0',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  color: property.status === 'available' ? '#00ff00' : '#666'
                }}>
                  {property.status.toUpperCase()}
                </p>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
