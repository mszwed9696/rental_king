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

        {/* Sorority Row Diagonal Sash for properties with Sorority Row type */}
        {property.type && property.type.includes('Sorority Row') && (
          <div style={{
            position: 'absolute',
            top: '30px',
            left: '-40px',
            transform: 'rotate(-45deg)',
            width: '200px',
            background: property.address === '38 CARPENTER ST' ? '#FFB6C1' :
                       property.address === '42 CARPENTER ST' ? '#D946EF' : '#FFB6C1',
            color: 'white',
            padding: '8px 0',
            textAlign: 'center',
            fontSize: '14px',
            fontWeight: 'bold',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            zIndex: 5
          }}>
            Sorority Row
          </div>
        )}

        {/* Status Badge - prioritize New Construction, Commercial, Townhome, then Rented, then Available */}
        {property.type && property.type.includes('New Construction') ? (
          <div style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: '#d3d3d3',
            color: '#333',
            padding: '4px 12px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 'bold',
            zIndex: 10
          }}>
            NEW CONSTRUCTION
          </div>
        ) : property.type && (property.type.includes('Commercial') || property.city === 'Commercial') ? (
          <div style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: '#d3d3d3',
            color: '#333',
            padding: '4px 12px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 'bold',
            zIndex: 10
          }}>
            COMMERCIAL
          </div>
        ) : property.type && (property.type.includes('Townhome') || property.type.includes('Townhouse')) ? (
          <div style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: '#d3d3d3',
            color: '#333',
            padding: '4px 12px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 'bold',
            zIndex: 10
          }}>
            TOWNHOME
          </div>
        ) : property.status === 'rented' ? (
          <div style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: '#666',
            color: 'white',
            padding: '4px 12px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 'bold',
            zIndex: 10
          }}>
            RENTED
          </div>
        ) : property.status === 'available' ? (
          <div style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: '#d3d3d3',
            color: '#333',
            padding: '4px 12px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 'bold',
            zIndex: 10
          }}>
            AVAILABLE
          </div>
        ) : null}
      </div>

      <div style={{ padding: '16px' }}>
        {/* Address */}
        <div style={{
          fontSize: '16px',
          fontWeight: '600',
          color: '#333',
          marginBottom: '8px'
        }}>
          {property.address}
        </div>

        {/* Bedrooms, Bathrooms, Parking */}
        <div style={{
          fontSize: '14px',
          color: '#666',
          marginBottom: '8px',
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap'
        }}>
          <span><strong>{property.beds}</strong> Bedrooms</span>
          <span><strong>{property.baths}</strong> Bathrooms</span>
          {property.parking && property.parking > 0 && (
            <span><strong>{property.parking}</strong> Parking</span>
          )}
        </div>

        {/* Rent Price or RENTED */}
        {property.status === 'rented' ? (
          <div style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#666',
            marginBottom: '8px'
          }}>
            RENTED
          </div>
        ) : (
          property.rent > 0 && (
            <div style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#00cc00',
              marginBottom: '8px'
            }}>
              ${property.rent.toLocaleString()}/mo
            </div>
          )
        )}

        {/* Start Date */}
        {property.leaseStart && (
          <div style={{
            fontSize: '14px',
            color: '#666',
            marginBottom: '12px'
          }}>
            Start Date: <strong>{property.leaseStart}</strong>
          </div>
        )}

        <a
          href={`mailto:rentalkinginfo@gmail.com?subject=Inquiry about ${property.address}&body=Hi, I'm interested in learning more about the property at ${property.address}.`}
          style={{
            display: 'block',
            marginTop: '12px',
            background: '#d3d3d3',
            color: '#333',
            padding: '10px 16px',
            borderRadius: '4px',
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '14px',
            textDecoration: 'none',
            transition: 'background 0.2s, transform 0.2s'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = '#c0c0c0';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = '#d3d3d3';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          INQUIRE
        </a>
      </div>
    </div>
  );
}
