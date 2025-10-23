/**
 * Apply Photo Updates to Rental King Properties
 *
 * Usage:
 * 1. Edit the headerImageFileIds object below with your file IDs
 * 2. Run: node apply_photo_updates.js
 */

const fs = require('fs');
const path = require('path');

// ========================================
// EDIT THIS SECTION WITH YOUR FILE IDS
// ========================================
// Format: 'FOLDER_ID': 'FILE_ID_OF_HEADER_IMAGE'
const headerImageFileIds = {
  '17j6Q4M1_7MW1Qn6JTgniOcHN_hqEWBRo': '1_eSPLCFu1m7jvCZlKyoqKj5TCEIDy02b', // 4 SILVER AVE
  '1oVXLPD0mAkX7lwi8eZrPO0uacuxmKc8y': '1hlz8DnoNM3K4j69bTgC10N0mUU4r3kP0', // 16 WEST ST
  '1YprVgtq0VtjJINoVyfUpJUVDkJMH99lp': '1rKBLcW3XqjMEB-IHDU5abkcU7kfneX-1', // 9 E. NEW ST
  '1JldBUsDdzdjP460caUxRod92MCIoypZJ': '1EURXn9L1e2MmpDvQ7KuKBvvzmFmz83e9', // 408 Swarthmore Rd (Humbert1)
  '1ey8y6bW3DMqx92jHxtwCVRQNcGHsp_6t': '1RF9HIaWhz5b27oxO-yznvlkipKuCBgu6', // 115 Silver Ave (Mcfadden2)
  '1V8duWNp9fEbyIybLkfO163EB79wtEEux': '1O1PScnIUYgtfyJLh8yQJy6D8hKHLfBOP', // 339 Oakwood Ave (Mcfadden3)
  '1zH3VIMeztLkMca2nqcAfh5IgM6KIpjJT': '12s4ItwWLMiqsHad0v5uBjdjh3gZ5ejCK', // 207 University Blvd (Hildebrant1)
  '1cNNaUYjo1mr4tOR7K3cw31mSZtSN66pW': '1NLYBtTpHttWB2vJy52ZqNIDKDQ6q6QZ8', // 52 State St (Agnes 3)
  '14MKCxwgf7fCRPW8CIKFqfdv0jEMplXWB': '1hzS2_9sqCvdZb03FoGAZzAQz8j4isFP3', // 18 Wilson Ave (Humbert2)
  '1TorA5joziDp40I4lBxb1KaMlJLuZVzB7': '1tTjZUEAglOfFb1IwvYUz6evJv3P121Ow', // 8 Fairmount Dr (Hildebrant3)
  '1SCtVwQKAbq_EuWkUo2DYlkAUhMmWNW64': '1TXfGXFlptTXTiexhp11HXLMnwWFxmDT2', // 306 Swarthmore Rd (Insana1)
  '1_0HYxIkTtTd9RbX0eld4EJNe_ws1rKNk': '1XT4pxvRN81_Xx4BpVrSEfyV28Zag-9Wi', // 107 Church St Apt A & B (Insana4 & Insana5)
  '1y34s5wo_4x8fznRi0NhH0pWJby3VWwFr': '1cz-EK5AZIo8urXOccyx1oq6rJSfHNFud', // Liscio1, Liscio2, Liscio3, Omalley1, Omalley2
  '1xg909ReIJwF9OSTDt6y6IG-Kr36Q7LAh': '1_Jrc5WfnWcYGfxSy6od4UG2DO8DlU8vf', // 12 Holly Ave (Agnes1)
  '1073yZZ7ODzKeQeuVCSEVO3tq2wsA4pvK': '1PW-qPCPksaDo2CKXnFFrchotVOvBHphZ', // 321 W. High St (Agnes 2)
  '1be8TsVEnSpl60jO2pD8yQAhgcadQqtkU': '1a9iGgSLU4FgPQMFDqA_q5kEaDd2Gg0Iv', // 613 Whitman (McFadden1)
  '1LPk8CcoHwDmShyAIvHtKh-C20XEtc5sF': '18VuBsEDCRiQ2DWzfAYyqZEdYKfbPlkgr', // 8 Sherwood Lane (Hildebrant2)
  '1Avbfcj03cxhf9P168vtaHEGNCBx9fwIv': '10JjLg_8nQd92-WW8g76SJry_pirF2fKV', // 305 N. Yale Rd (Insana2)
  '1ScB2y2VXY8YGMIV8ffqSR7BQ8JAsQJag': '1IZZrOZOf6MIcdmlddwEfZ9eZbcQ1cAC4', // 308 Swarthmore Rd (Insana3)
  '1jEs-H615yOcQLUOM08bw4ANkGEVW2ORZ': '106Mm8Ad94OhKzDi79qpJBqyGPSLifq2I', // 303 N Lehigh Rd (Jayna13)
  '1shchyArEwvoJeiFWhvW_hoTQlQ1S2b8t': '1P77MX3OwtB34CONnTDTvXf9FLWPwi2Nk', // 1 Pennsylvania Rd (Jayna1-7)
  '1g4Pt1txSTHzYfh6sKFVqMtH3oP6nquFq': '1QgVszJFAXTc2QU_9w17p2xeWSutLMBNL', // 126-128 S. Main St (Jayna8-11)
  '1e_18y_YJasQIFguefGqR6yvJd_q89xfu': '1Sozm4c1db6jKR3tCF2tciyM_oBcnjPvJ', // 25 Zane St (Jayna12)
  '1y34s5wo_4x8fznRi0NhH0pWJby3VWwFr': '1cz-EK5AZIo8urXOccyx1oq6rJSfHNFud', // 349-351 Oakwood Ave (Jayna14-16)
  '1dg8IcZu8ehq-LlYzXFVutRMWEyBYGJ4q': '1RypmmJYPCYQjyvxxK4rjQBE3j36U2P7h', // 357 Oakwood Ave (Jayna17-22)
  '1OhyIyXbDeH7RJPBBhYGXkfNrqL370aE-': '1UZaaUesQ-6FejcsECaDzJV-TQMf9HPQT', // 6 Franklin Rd (Liscio1)
};
// ========================================

// Load current property data
const dataPath = path.join(__dirname, 'RENTAL_KING_COMPLETE_DATA.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Properties that should NOT be updated (already have real photos)
const propertiesWithRealPhotos = [
  'P031', 'P032', 'P033', 'P028', 'P030', 'P034', 'P019', 'P018', 'P017',
  'P015', 'P041', 'P010', 'P011', 'P009', 'P007', 'P006', 'P004', 'P040',
  'p003', 'P026', 'P025', 'P035', 'P036', 'P037', 'P038', 'P013', 'P027',
  'P029', 'P005', 'P023', 'P022', 'P014', 'P016', 'P020', 'P012', 'P021',
  'P008', 'P039'
];

function updatePropertyPhotos() {
  console.log('=== Starting Photo Update Process ===\n');

  if (Object.keys(headerImageFileIds).length === 0) {
    console.error('ERROR: No file IDs provided in headerImageFileIds object!');
    console.error('Please edit this script and add your file ID mappings.');
    return;
  }

  let updatedCount = 0;
  let skippedCount = 0;
  const updatedProperties = [];

  data.properties.forEach(property => {
    // Skip if property already has a real photo
    if (propertiesWithRealPhotos.includes(property.id)) {
      return;
    }

    // Skip if not available
    if (property.status !== 'available') {
      return;
    }

    // Check if we have a file ID mapping for this property's folder
    if (property.photo_folder_id && headerImageFileIds[property.photo_folder_id]) {
      const fileId = headerImageFileIds[property.photo_folder_id];
      const newPhotoUrl = `https://lh3.googleusercontent.com/d/${fileId}=w800-h600-c`;

      const oldUrl = property.photoUrl || 'NONE';
      property.photoUrl = newPhotoUrl;
      updatedCount++;

      updatedProperties.push({
        id: property.id,
        address: property.address,
        oldUrl: oldUrl,
        newUrl: newPhotoUrl
      });

      console.log(`✓ Updated ${property.id} - ${property.address}`);
      console.log(`  Old: ${oldUrl}`);
      console.log(`  New: ${newPhotoUrl}\n`);
    } else if (property.photo_folder_id) {
      console.log(`⚠ Skipped ${property.id} - ${property.address} (no file ID mapping for folder ${property.photo_folder_id})`);
      skippedCount++;
    }
  });

  if (updatedCount === 0) {
    console.log('\n❌ No properties were updated.');
    console.log('Please check that your file ID mappings match the folder IDs in the data.\n');
    return;
  }

  // Create backup
  const backupPath = path.join(__dirname, `RENTAL_KING_COMPLETE_DATA.backup.${Date.now()}.json`);
  fs.writeFileSync(backupPath, JSON.stringify(data, null, 2));
  console.log(`\n📦 Backup created: ${backupPath}`);

  // Update metadata
  data.meta.updated = new Date().toISOString();

  // Save updated data
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

  console.log(`\n✅ SUCCESS!`);
  console.log(`   Updated: ${updatedCount} properties`);
  console.log(`   Skipped: ${skippedCount} properties (no mapping)`);
  console.log(`   File saved: ${dataPath}`);
  console.log(`\nNext steps:`);
  console.log(`1. Review the changes in the JSON file`);
  console.log(`2. Test locally: npm run dev`);
  console.log(`3. Deploy to Vercel: vercel --prod`);

  return updatedProperties;
}

// Run the update
if (require.main === module) {
  try {
    updatePropertyPhotos();
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error(error.stack);
  }
}

module.exports = { updatePropertyPhotos };
