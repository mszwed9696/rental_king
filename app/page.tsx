'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Property } from '../lib/properties';
import PropertyCard from '../components/PropertyCard';

// Dynamically import Map to avoid SSR issues with Leaflet
const Map = dynamic(() => import('../components/Map'), {
  ssr: false,
  loading: () => <div style={{ width: '100%', height: '600px', background: '#e5e7eb' }}>Loading map...</div>,
});

export default function Home() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [filter, setFilter] = useState<'all' | 'available' | 'rented'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [mapActive, setMapActive] = useState(false);

  // Fetch properties from API
  useEffect(() => {
    async function fetchProperties() {
      try {
        const response = await fetch('/api/properties');
        const data = await response.json();
        setProperties(data.properties || []);
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProperties();
  }, []);

  // Deactivate map when scrolling outside of it
  useEffect(() => {
    const handleScroll = () => {
      const mapSection = document.getElementById('map-section');
      if (mapSection && mapActive) {
        const rect = mapSection.getBoundingClientRect();
        // If map is scrolled out of view, deactivate it
        if (rect.bottom < 0 || rect.top > window.innerHeight) {
          setMapActive(false);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mapActive]);

  const filteredProperties = properties.filter((property) => {
    const matchesFilter = filter === 'all' || property.status === filter;
    const matchesSearch = searchTerm === '' ||
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.address.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handlePropertyClick = (propertyId: string) => {
    const element = document.getElementById(`property-${propertyId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Highlight the property briefly
      element.style.boxShadow = '0 0 0 3px #00ff00';
      setTimeout(() => {
        element.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
      }, 2000);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Loading properties...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      {/* Header with Banner */}
      <header style={{
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'relative',
          width: '100%',
          height: 'clamp(120px, 15vh, 180px)',
        }}>
          <img
            src="/banner.avif"
            alt="Rental King Banner"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              opacity: 1,
            }}
          />
        </div>
      </header>

      {/* Search and Filter Bar */}
      <div style={{
        background: 'white',
        padding: '20px 0',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px',
          display: 'flex',
          gap: '16px',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}>
          <input
            type="text"
            placeholder="Enter an address or zipcode"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: '1',
              minWidth: '250px',
              padding: '12px 16px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px',
            }}
          />

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'available' | 'rented')}
            style={{
              padding: '12px 16px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px',
              background: 'white',
              cursor: 'pointer',
            }}
          >
            <option value="all">All Properties ({properties.length})</option>
            <option value="available">Available ({properties.filter(p => p.status === 'available').length})</option>
            <option value="rented">Rented ({properties.filter(p => p.status === 'rented').length})</option>
          </select>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '30px 20px',
      }}>
        {/* Map Section */}
        <div
          id="map-section"
          style={{
            background: 'white',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '30px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <h2 style={{
            fontSize: 'clamp(20px, 5vw, 24px)',
            fontWeight: 'bold',
            color: '#0033CC',
            marginBottom: '16px',
          }}>
            Property Locations
          </h2>
          <div
            style={{
              height: 'min(600px, 70vh)',
              position: 'relative',
              overflow: 'hidden',
            }}
            onClick={() => setMapActive(true)}
            onTouchStart={() => setMapActive(true)}
          >
            {/* Tap to Use Overlay for Mobile */}
            {!mapActive && (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(0, 51, 204, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10,
                  cursor: 'pointer',
                  backdropFilter: 'blur(1px)',
                }}
              >
                <div style={{
                  background: 'white',
                  padding: '16px 32px',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: '#0033CC',
                  textAlign: 'center',
                }}>
                  Tap to use map
                </div>
              </div>
            )}
            <div style={{
              pointerEvents: mapActive ? 'auto' : 'none',
              height: '100%',
            }}>
              <Map
                properties={filteredProperties}
                selectedProperty={selectedProperty}
                onPropertyClick={handlePropertyClick}
              />
            </div>
          </div>
        </div>

        {/* Listings Section */}
        <div style={{ marginTop: '30px' }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#0033CC',
            marginBottom: '20px',
          }}>
            {filter === 'all' && 'All Properties'}
            {filter === 'available' && 'Available Properties'}
            {filter === 'rented' && 'Rented Properties'}
            <span style={{ color: '#666', fontWeight: 'normal', fontSize: '18px', marginLeft: '12px' }}>
              ({filteredProperties.length} {filteredProperties.length === 1 ? 'property' : 'properties'})
            </span>
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))',
            gap: '24px',
          }}>
            {filteredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onHover={() => setSelectedProperty(property)}
              />
            ))}
          </div>

          {filteredProperties.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              background: 'white',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}>
              <p style={{ fontSize: '18px', color: '#666' }}>
                No properties found matching your criteria.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        background: '#0033CC',
        color: 'white',
        padding: '30px 20px',
        marginTop: '60px',
        textAlign: 'center',
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
        }}>
          <img src="/logo.png" alt="Rental King" style={{ height: '80px', marginBottom: '16px' }} />
          <p style={{ fontSize: '14px', marginBottom: '16px' }}>
            Quality Student Housing near Rowan University
          </p>
          <div style={{ fontSize: '14px', color: '#00ff00', marginBottom: '8px' }}>
            <a href="mailto:rentalkinginfo@gmail.com" style={{ color: '#00ff00', textDecoration: 'none' }}>
              Email: rentalkinginfo@gmail.com
            </a>
          </div>
          <div style={{ fontSize: '14px', color: '#00ff00' }}>
            <a href="sms:+18562156915" style={{ color: '#00ff00', textDecoration: 'none' }}>
              Text: (856) 215-6915
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
