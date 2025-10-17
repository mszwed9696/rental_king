'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Property } from '../lib/properties';

// Fix for default marker icon
const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="display: flex; align-items: center; justify-content: center;">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="${color}" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z" stroke="#fff" stroke-width="1"/>
      </svg>
    </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

const availableIcon = createCustomIcon('#d3d3d3');
const rentedIcon = createCustomIcon('#666');

interface MapProps {
  properties: Property[];
  selectedProperty?: Property | null;
  onPropertyClick?: (propertyId: string) => void;
}

export default function Map({ properties, selectedProperty, onPropertyClick }: MapProps) {
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
        url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
      />
      {properties.map((property) => {
        if (!property.lat || !property.lng) return null;

        return (
          <Marker
            key={property.id}
            position={[property.lat, property.lng]}
            icon={property.status === 'available' ? availableIcon : rentedIcon}
            eventHandlers={{
              click: () => {
                if (onPropertyClick) {
                  onPropertyClick(property.id);
                }
              }
            }}
          >
            <Popup>
              <div style={{ padding: '8px' }}>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 'bold' }}>
                  {property.title}
                </h3>
                <p style={{ margin: '4px 0', fontSize: '14px' }}>{property.address}</p>
                {property.rent > 0 && (
                  <p style={{ margin: '4px 0', fontSize: '14px', fontWeight: 'bold', color: '#0033CC' }}>
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
                  color: property.status === 'available' ? '#0033CC' : '#666'
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
