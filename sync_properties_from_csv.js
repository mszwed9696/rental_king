const fs = require('fs');
const path = require('path');

// Load current JSON data
const dataPath = path.join(__dirname, 'RENTAL_KING_COMPLETE_DATA.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

console.log('=== Starting Property Sync ===\n');

// Step 1: Remove phantom properties
const phantomIds = ['Liscio2', 'Liscio3', 'Omalley1', 'Omalley2'];
console.log('Step 1: Removing phantom properties...');
const originalCount = data.properties.length;
data.properties = data.properties.filter(p => !phantomIds.includes(p.id));
const removedCount = originalCount - data.properties.length;
console.log(`  Removed ${removedCount} phantom properties\n`);

// Step 2: Fix Liscio1
console.log('Step 2: Fixing Liscio1...');
const liscio1 = data.properties.find(p => p.id === 'Liscio1');
if (liscio1) {
  liscio1.title = '6 Franklin Rd';
  liscio1.address = '6 Franklin Rd';
  liscio1.type = 'Residential';
  liscio1.beds = 4;
  liscio1.baths = 1;
  liscio1.rent = 2500;
  liscio1.parking = 2;
  liscio1.leaseStart = '6-1-26';
  liscio1.photo_folder_id = '1OhyIyXbDeH7RJPBBhYGXkfNrqL370aE-';
  liscio1.photoUrl = ''; // Will need to extract header image later
  console.log('  Fixed Liscio1 -> 6 Franklin Rd\n');
}

// Step 3: Add missing Jayna properties
console.log('Step 3: Adding 22 missing Jayna properties...');
const jaynaProperties = [
  {
    id: 'Jayna1',
    title: '1 Pennsylvania Rd Apt 2',
    address: '1 Pennsylvania Rd Apt 2',
    email: 'universitycampusliving@gmail.com',
    type: 'Apartment',
    beds: 2,
    baths: 1,
    rent: 1750,
    parking: 1,
    status: 'available',
    leaseStart: '8-1-26',
    photo_folder_id: '1shchyArEwvoJeiFWhvW_hoTQlQ1S2b8t',
    lat: 39.7050351590367,
    lng: -75.12267042002554
  },
  {
    id: 'Jayna2',
    title: '1 Pennsylvania Rd Apt 4',
    address: '1 Pennsylvania Rd Apt 4',
    email: 'universitycampusliving@gmail.com',
    type: 'Apartment',
    beds: 2,
    baths: 1,
    rent: 1750,
    parking: 1,
    status: 'available',
    leaseStart: '8-15-26',
    photo_folder_id: '1shchyArEwvoJeiFWhvW_hoTQlQ1S2b8t',
    lat: 39.7050351590367,
    lng: -75.12267042002554
  },
  {
    id: 'Jayna3',
    title: '1 Pennsylvania Rd Apt 5',
    address: '1 Pennsylvania Rd Apt 5',
    email: 'universitycampusliving@gmail.com',
    type: 'Apartment',
    beds: 2,
    baths: 1,
    rent: 1750,
    parking: 1,
    status: 'available',
    leaseStart: '9-15-26',
    photo_folder_id: '1shchyArEwvoJeiFWhvW_hoTQlQ1S2b8t',
    lat: 39.7050351590367,
    lng: -75.12267042002554
  },
  {
    id: 'Jayna4',
    title: '1 Pennsylvania Rd Apt 8',
    address: '1 Pennsylvania Rd Apt 8',
    email: 'universitycampusliving@gmail.com',
    type: 'Apartment',
    beds: 2,
    baths: 1,
    rent: 1750,
    parking: 1,
    status: 'available',
    leaseStart: '9-15-26',
    photo_folder_id: '1shchyArEwvoJeiFWhvW_hoTQlQ1S2b8t',
    lat: 39.7050351590367,
    lng: -75.12267042002554
  },
  {
    id: 'Jayna5',
    title: '1 Pennsylvania Rd Apt 11',
    address: '1 Pennsylvania Rd Apt 11',
    email: 'universitycampusliving@gmail.com',
    type: 'Apartment',
    beds: 2,
    baths: 1,
    rent: 1750,
    parking: 1,
    status: 'available',
    leaseStart: '7-1-26',
    photo_folder_id: '1shchyArEwvoJeiFWhvW_hoTQlQ1S2b8t',
    lat: 39.7050351590367,
    lng: -75.12267042002554
  },
  {
    id: 'Jayna6',
    title: '1 Pennsylvania Apt 12',
    address: '1 Pennsylvania Apt 12',
    email: 'universitycampusliving@gmail.com',
    type: 'Apartment',
    beds: 2,
    baths: 1,
    rent: 1750,
    parking: 1,
    status: 'available',
    leaseStart: '6-1-26',
    photo_folder_id: '1shchyArEwvoJeiFWhvW_hoTQlQ1S2b8t',
    lat: 39.7050351590367,
    lng: -75.12267042002554
  },
  {
    id: 'Jayna7',
    title: '1 Pennsylvania Rd Apt 15',
    address: '1 Pennsylvania Rd Apt 15',
    email: 'universitycampusliving@gmail.com',
    type: 'Apartment',
    beds: 2,
    baths: 1,
    rent: 1750,
    parking: 1,
    status: 'available',
    leaseStart: '8-15-26',
    photo_folder_id: '1shchyArEwvoJeiFWhvW_hoTQlQ1S2b8t',
    lat: 39.7050351590367,
    lng: -75.12267042002554
  },
  {
    id: 'Jayna8',
    title: '126 S. Main St Apt A',
    address: '126 S. Main St Apt A',
    email: 'universitycampusliving@gmail.com',
    type: 'Apartment',
    beds: 1,
    baths: 1,
    rent: 1300,
    parking: 1,
    status: 'available',
    leaseStart: '11-1-25',
    photo_folder_id: '1g4Pt1txSTHzYfh6sKFVqMtH3oP6nquFq',
    lat: 39.69937318286572,
    lng: -75.11240260046185
  },
  {
    id: 'Jayna9',
    title: '126 S. Main St Apt B',
    address: '126 S. Main St Apt B',
    email: 'universitycampusliving@gmail.com',
    type: 'Apartment',
    beds: 1,
    baths: 1,
    rent: 1300,
    parking: 1,
    status: 'available',
    leaseStart: '6-15-26',
    photo_folder_id: '1g4Pt1txSTHzYfh6sKFVqMtH3oP6nquFq',
    lat: 39.69937318286572,
    lng: -75.11240260046185
  },
  {
    id: 'Jayna10',
    title: '126 S. Main St Apt C',
    address: '126 S. Main St Apt C',
    email: 'universitycampusliving@gmail.com',
    type: 'Apartment',
    beds: 1,
    baths: 1,
    rent: 1300,
    parking: 1,
    status: 'available',
    leaseStart: '8-1-26',
    photo_folder_id: '1g4Pt1txSTHzYfh6sKFVqMtH3oP6nquFq',
    lat: 39.69937318286572,
    lng: -75.11240260046185
  },
  {
    id: 'Jayna11',
    title: '128 S. Main St',
    address: '128 S. Main St',
    email: 'universitycampusliving@gmail.com',
    type: 'House',
    beds: 4,
    baths: 2,
    rent: 3000,
    parking: 4,
    status: 'available',
    leaseStart: '6-15-26',
    photo_folder_id: '1g4Pt1txSTHzYfh6sKFVqMtH3oP6nquFq',
    lat: 39.69937318286572,
    lng: -75.11240260046185
  },
  {
    id: 'Jayna12',
    title: '25 Zane St Unit A',
    address: '25 Zane St Unit A',
    email: 'universitycampusliving@gmail.com',
    type: 'Apartment',
    beds: 3,
    baths: 2,
    rent: 2300,
    parking: 3,
    status: 'available',
    leaseStart: '8-15-26',
    photo_folder_id: '1e_18y_YJasQIFguefGqR6yvJd_q89xfu',
    lat: 39.69972435884718,
    lng: -75.11531948018954
  },
  {
    id: 'Jayna13',
    title: '303 N Lehigh Rd',
    address: '303 N Lehigh Rd',
    email: 'universitycampusliving@gmail.com',
    type: 'House',
    beds: 9,
    baths: 4,
    rent: 7000,
    parking: 10,
    status: 'available',
    leaseStart: '8-1-26',
    photo_folder_id: '1jEs-H615yOcQLUOM08bw4ANkGEVW2ORZ',
    lat: 39.71075473199128,
    lng: -75.13036775559776
  },
  {
    id: 'Jayna14',
    title: '349 Oakwood Ave',
    address: '349 Oakwood Ave',
    email: 'universitycampusliving@gmail.com',
    type: 'Apartment',
    beds: 1,
    baths: 1,
    rent: 1300,
    parking: 1,
    status: 'available',
    leaseStart: '8-1-26',
    photo_folder_id: '1y34s5wo_4x8fznRi0NhH0pWJby3VWwFr',
    lat: 39.70478510998917,
    lng: -75.12073023237244
  },
  {
    id: 'Jayna15',
    title: '351 Oakwood Ave Apt A',
    address: '351 Oakwood Ave Apt A',
    email: 'universitycampusliving@gmail.com',
    type: 'Apartment',
    beds: 1,
    baths: 1,
    rent: 1300,
    parking: 1,
    status: 'available',
    leaseStart: '3-1-26',
    photo_folder_id: '1y34s5wo_4x8fznRi0NhH0pWJby3VWwFr',
    lat: 39.70478510998917,
    lng: -75.12073023237244
  },
  {
    id: 'Jayna16',
    title: '351 Oakwood Ave Apt C',
    address: '351 Oakwood Ave Apt C',
    email: 'universitycampusliving@gmail.com',
    type: 'Apartment',
    beds: 1,
    baths: 1,
    rent: 1300,
    parking: 1,
    status: 'available',
    leaseStart: '11-15-25',
    photo_folder_id: '1y34s5wo_4x8fznRi0NhH0pWJby3VWwFr',
    lat: 39.70478510998917,
    lng: -75.12073023237244
  },
  {
    id: 'Jayna17',
    title: '357 Oakwood Ave Apt 101',
    address: '357 Oakwood Ave Apt 101',
    email: 'universitycampusliving@gmail.com',
    type: 'Apartment',
    beds: 1,
    baths: 1,
    rent: 1400,
    parking: 1,
    status: 'available',
    leaseStart: '7-1-26',
    photo_folder_id: '1dg8IcZu8ehq-LlYzXFVutRMWEyBYGJ4q',
    lat: 39.70482225383033,
    lng: -75.12088580048842
  },
  {
    id: 'Jayna18',
    title: '357 Oakwood Ave Apt 103',
    address: '357 Oakwood Ave Apt 103',
    email: 'universitycampusliving@gmail.com',
    type: 'Apartment',
    beds: 1,
    baths: 1,
    rent: 1400,
    parking: 1,
    status: 'available',
    leaseStart: '6-1-26',
    photo_folder_id: '1dg8IcZu8ehq-LlYzXFVutRMWEyBYGJ4q',
    lat: 39.70482225383033,
    lng: -75.12088580048842
  },
  {
    id: 'Jayna19',
    title: '357 Oakwood Ave Apt 201',
    address: '357 Oakwood Ave Apt 201',
    email: 'universitycampusliving@gmail.com',
    type: 'Apartment',
    beds: 3,
    baths: 3,
    rent: 2400,
    parking: 3,
    status: 'available',
    leaseStart: '8-1-26',
    photo_folder_id: '1dg8IcZu8ehq-LlYzXFVutRMWEyBYGJ4q',
    lat: 39.70482225383033,
    lng: -75.12088580048842
  },
  {
    id: 'Jayna20',
    title: '357 Oakwood Ave Apt 202',
    address: '357 Oakwood Ave Apt 202',
    email: 'universitycampusliving@gmail.com',
    type: 'Apartment',
    beds: 3,
    baths: 3,
    rent: 2400,
    parking: 3,
    status: 'available',
    leaseStart: '8-15-26',
    photo_folder_id: '1dg8IcZu8ehq-LlYzXFVutRMWEyBYGJ4q',
    lat: 39.70482225383033,
    lng: -75.12088580048842
  },
  {
    id: 'Jayna21',
    title: '357 Oakwood Ave Apt 203',
    address: '357 Oakwood Ave Apt 203',
    email: 'universitycampusliving@gmail.com',
    type: 'Apartment',
    beds: 3,
    baths: 3,
    rent: 2400,
    parking: 3,
    status: 'available',
    leaseStart: '7-15-26',
    photo_folder_id: '1dg8IcZu8ehq-LlYzXFVutRMWEyBYGJ4q',
    lat: 39.70482225383033,
    lng: -75.12088580048842
  },
  {
    id: 'Jayna22',
    title: '357 Oakwood Ave Apt 204',
    address: '357 Oakwood Ave Apt 204',
    email: 'universitycampusliving@gmail.com',
    type: 'Apartment',
    beds: 3,
    baths: 3,
    rent: 2400,
    parking: 3,
    status: 'available',
    leaseStart: '8-1-26',
    photo_folder_id: '1dg8IcZu8ehq-LlYzXFVutRMWEyBYGJ4q',
    lat: 39.70482225383033,
    lng: -75.12088580048842
  }
];

// Convert to full property format
jaynaProperties.forEach(prop => {
  const fullProperty = {
    id: prop.id,
    title: prop.title,
    address: prop.address,
    city: '',
    email: prop.email,
    type: prop.type,
    beds: prop.beds,
    baths: prop.baths,
    rent: prop.rent,
    sqft: '',
    status: prop.status,
    photo_folder_id: prop.photo_folder_id,
    photo_urls: '',
    map_link: '',
    parking: prop.parking,
    leaseStart: prop.leaseStart,
    lat: prop.lat || null,
    lng: prop.lng || null,
    photoUrl: '' // Will extract header images later
  };

  data.properties.push(fullProperty);
  console.log(`  Added ${prop.id} - ${prop.address}`);
});

console.log(`\n  Total Jayna properties added: ${jaynaProperties.length}\n`);

// Create backup
const backupPath = path.join(__dirname, `RENTAL_KING_COMPLETE_DATA.backup.${Date.now()}.json`);
fs.writeFileSync(backupPath, JSON.stringify(data, null, 2));
console.log(`📦 Backup created: ${backupPath}`);

// Update metadata
data.meta.updated = new Date().toISOString();

// Save updated data
fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

console.log(`\n✅ SYNC COMPLETE!`);
console.log(`   Removed: ${removedCount} phantom properties`);
console.log(`   Fixed: Liscio1`);
console.log(`   Added: ${jaynaProperties.length} Jayna properties`);
console.log(`   Total properties now: ${data.properties.length}`);
console.log(`\nNext steps:`);
console.log(`1. Extract header images for new properties`);
console.log(`2. Deploy to Vercel`);
