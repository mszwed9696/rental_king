import React from 'react';
import { Property } from '../lib/properties';
import Image from 'next/image';

interface PropertyCardProps {
  property: Property;
  onHover?: () => void;
}

export default function PropertyCard({ property, onHover }: PropertyCardProps) {
  const [imageError, setImageError] = React.useState(false);
  const imageUrl = property.photoUrl || '/logo.svg';

  return (
    <div
      className="property-card"
      id={`property-${property.id}`}
      onMouseEnter={onHover}
      style={{
        background: 'white',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        scrollMarginTop: '100px',
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
      }}
    >
      <div style={{
        width: '100%',
        height: '200px',
        background: imageError || !property.photoUrl ? '#0033CC' : '#f0f0f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {!imageError && property.photoUrl && property.photoUrl !== '/logo.svg' ? (
          <img
            src={imageUrl}
            alt={property.title}
            onError={() => setImageError(true)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        ) : (
          <img
            src="/logo.png"
            alt="Rental King"
            style={{ width: '120px', height: 'auto' }}
          />
        )}
        {property.status === 'rented' && (
          <div style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: '#666',
            color: 'white',
            padding: '4px 12px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 'bold'
          }}>
            RENTED
          </div>
        )}
        {property.status === 'available' && (
          <div style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: '#00ff00',
            color: '#0033CC',
            padding: '4px 12px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 'bold'
          }}>
            AVAILABLE
          </div>
        )}
      </div>

      <div style={{ padding: '16px' }}>
        {property.rent > 0 && (
          <div style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#0033CC',
            marginBottom: '8px'
          }}>
            ${property.rent.toLocaleString()}/mo
          </div>
        )}

        <div style={{
          fontSize: '14px',
          color: '#666',
          marginBottom: '12px',
          display: 'flex',
          gap: '12px'
        }}>
          <span><strong>{property.beds}</strong> Bedrooms</span>
          <span><strong>{property.baths}</strong> Bathrooms</span>
          {property.sqft && property.sqft > 0 && (
            <span><strong>{property.sqft}</strong> sqft</span>
          )}
        </div>

        <div style={{
          fontSize: '16px',
          fontWeight: '600',
          color: '#333',
          marginBottom: '8px'
        }}>
          {property.address}
        </div>

        {property.type && (
          <div style={{
            fontSize: '13px',
            color: '#00ff00',
            fontWeight: '600',
            marginTop: '8px',
            background: '#0033CC',
            padding: '4px 8px',
            borderRadius: '4px',
            display: 'inline-block'
          }}>
            {property.type}
          </div>
        )}

        <a
          href={`mailto:rentalkinginfo@gmail.com?subject=Inquiry about ${property.address}&body=Hi, I'm interested in learning more about the property at ${property.address}.`}
          style={{
            display: 'block',
            marginTop: '12px',
            background: '#00ff00',
            color: '#0033CC',
            padding: '10px 16px',
            borderRadius: '4px',
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '14px',
            textDecoration: 'none',
            transition: 'background 0.2s, transform 0.2s'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = '#00dd00';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = '#00ff00';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          INQUIRE
        </a>
      </div>
    </div>
  );
}
