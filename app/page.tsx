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
          height: '200px',
        }}>
          <img
            src="/banner.avif"
            alt="Rental King Banner"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: 1
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
        zIndex: 100,
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
        <div style={{
          background: 'white',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '30px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#0033CC',
            marginBottom: '16px',
          }}>
            Property Locations
          </h2>
          <Map
            properties={filteredProperties}
            selectedProperty={selectedProperty}
            onPropertyClick={handlePropertyClick}
          />
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
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
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
          <p style={{ fontSize: '14px', marginBottom: '8px' }}>
            Quality Student Housing near Rowan University
          </p>
          <p style={{ fontSize: '14px', color: '#00ff00' }}>
            Contact: DANDESILVIO@GMAIL.COM
          </p>
        </div>
      </footer>
    </div>
  );
}
