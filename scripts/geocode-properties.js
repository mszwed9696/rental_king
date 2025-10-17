// Script to geocode properties using OpenStreetMap Nominatim API (free, no API key needed)
const fs = require('fs');
const path = require('path');

// Read the complete data file
const dataPath = path.join(__dirname, '..', 'RENTAL_KING_COMPLETE_DATA.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Function to geocode an address using Nominatim
async function geocodeAddress(address, city) {
  const query = `${address}, ${city}`;
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'RentalKing/1.0'
      }
    });
    const results = await response.json();

    if (results && results.length > 0) {
      return {
        lat: parseFloat(results[0].lat),
        lng: parseFloat(results[0].lon)
      };
    }
    return null;
  } catch (error) {
    console.error(`Error geocoding ${query}:`, error.message);
    return null;
  }
}

// Add delay to respect rate limits
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function updateCoordinates() {
  let updated = 0;

  for (const property of data.properties) {
    // Skip if already has coordinates
    if (property.lat && property.lng) {
      console.log(`✓ ${property.address} - already has coordinates`);
      continue;
    }

    console.log(`Geocoding ${property.address}...`);
    const coords = await geocodeAddress(property.address, property.city);

    if (coords) {
      property.lat = coords.lat;
      property.lng = coords.lng;
      property.data_source = 'Coordinates from Nominatim geocoding';
      console.log(`✓ ${property.address} - ${coords.lat}, ${coords.lng}`);
      updated++;
    } else {
      console.log(`✗ ${property.address} - failed to geocode`);
    }

    // Wait 1 second between requests to respect rate limits
    await delay(1000);
  }

  // Save updated data
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
  console.log(`\n✓ Updated ${updated} properties with coordinates`);
  console.log(`✓ Saved to ${dataPath}`);
}

updateCoordinates().catch(console.error);
