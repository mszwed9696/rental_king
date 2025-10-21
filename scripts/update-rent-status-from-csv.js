const fs = require('fs');
const path = require('path');

// Read the CSV file
const csvPath = '/tmp/rental_listings.csv';
const csvData = fs.readFileSync(csvPath, 'utf-8');

// Parse CSV
const lines = csvData.trim().split('\n');
const headers = lines[0].split(',');

console.log('CSV Headers:', headers);
console.log('\n');

// Find column indices
const idIndex = headers.indexOf('id');
const rentIndex = headers.indexOf('rent'); // Column H
const statusIndex = headers.indexOf('status'); // Column J

console.log(`Column indices - ID: ${idIndex}, Rent: ${rentIndex}, Status: ${statusIndex}\n`);

// Parse CSV properly handling quoted fields
function parseCSVLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  values.push(current.trim());
  return values;
}

// Create a map of property updates from CSV
const updates = {};
for (let i = 1; i < lines.length; i++) {
  const values = parseCSVLine(lines[i]);

  const id = values[idIndex];
  let rent = values[rentIndex];
  const status = values[statusIndex];

  // Handle rent - if it says "RENTED", set rent to 0
  if (rent && rent.toUpperCase() === 'RENTED') {
    rent = 0;
  } else {
    rent = parseInt(rent) || 0;
  }

  // Normalize status
  let normalizedStatus = 'available';
  if (status) {
    const statusLower = status.toLowerCase();
    if (statusLower === 'rented' || statusLower === 'coming soon') {
      normalizedStatus = 'rented';
    } else if (statusLower.includes('new construction')) {
      normalizedStatus = 'available';
    }
  }

  updates[id] = {
    rent: rent,
    status: normalizedStatus
  };
}

console.log(`Loaded ${Object.keys(updates).length} properties from CSV\n`);

// Read the properties.ts file
const propertiesPath = path.join(__dirname, '../lib/properties.ts');
let propertiesContent = fs.readFileSync(propertiesPath, 'utf-8');

// Track changes
const changes = [];
let updatedCount = 0;

// Update each property in the file
for (const [propId, update] of Object.entries(updates)) {
  // Create regex to find this property's object
  // Looking for the property block that contains this ID
  const idPattern = `id:\\s*['"]${propId}['"]`;

  // Find the start of this property object
  const idMatch = propertiesContent.match(new RegExp(idPattern));
  if (!idMatch) {
    continue;
  }

  const idPos = propertiesContent.indexOf(idMatch[0]);

  // Find the opening brace before the id
  let bracePos = propertiesContent.lastIndexOf('{', idPos);

  // Find the closing brace after the id
  let braceCount = 1;
  let endPos = bracePos + 1;
  while (braceCount > 0 && endPos < propertiesContent.length) {
    if (propertiesContent[endPos] === '{') braceCount++;
    if (propertiesContent[endPos] === '}') braceCount--;
    endPos++;
  }

  // Extract the property object
  const propertyBlock = propertiesContent.substring(bracePos, endPos);

  // Extract current values
  const currentRentMatch = propertyBlock.match(/rent:\s*(\d+)/);
  const currentStatusMatch = propertyBlock.match(/status:\s*['"](\w+)['"]/);

  if (!currentRentMatch || !currentStatusMatch) {
    continue;
  }

  const currentRent = parseInt(currentRentMatch[1]);
  const currentStatus = currentStatusMatch[1];

  const newRent = update.rent;
  const newStatus = update.status;

  // Check if update is needed
  if (currentRent !== newRent || currentStatus !== newStatus) {
    let updatedBlock = propertyBlock;

    // Update rent
    updatedBlock = updatedBlock.replace(/rent:\s*\d+/, `rent: ${newRent}`);

    // Update status
    updatedBlock = updatedBlock.replace(/status:\s*['"](?:available|rented)['"]/, `status: '${newStatus}'`);

    // Replace in the main content
    propertiesContent = propertiesContent.substring(0, bracePos) +
                       updatedBlock +
                       propertiesContent.substring(endPos);

    changes.push({
      id: propId,
      oldRent: currentRent,
      newRent: newRent,
      oldStatus: currentStatus,
      newStatus: newStatus
    });

    updatedCount++;
  }
}

// Write the updated file
fs.writeFileSync(propertiesPath, propertiesContent);

// Output summary
console.log('╔═══════════════════════════════════════╗');
console.log('║       UPDATE SUMMARY                  ║');
console.log('╚═══════════════════════════════════════╝\n');
console.log(`Total properties in CSV: ${Object.keys(updates).length}`);
console.log(`Properties updated: ${updatedCount}\n`);

if (changes.length > 0) {
  console.log('╔═══════════════════════════════════════╗');
  console.log('║       DETAILED CHANGES                ║');
  console.log('╚═══════════════════════════════════════╝\n');

  changes.forEach(change => {
    console.log(`Property: ${change.id}`);
    if (change.oldRent !== change.newRent) {
      console.log(`  Rent: $${change.oldRent} → $${change.newRent}`);
    }
    if (change.oldStatus !== change.newStatus) {
      console.log(`  Status: ${change.oldStatus} → ${change.newStatus}`);
    }
    console.log('');
  });
}

console.log('✅ Properties file updated successfully!\n');
