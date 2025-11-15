# Photo Update Guide for Rental King Properties

## Overview
22 properties need header photos from Google Drive. Most properties don't have folder IDs in the system yet.

## Properties Needing Photos

### Properties WITH Folder IDs (Priority - 3 properties):
These already have folder IDs but are showing placeholder images:

1. **4 SILVER AVE** (ID: xxx)
   - Folder: https://drive.google.com/drive/folders/17j6Q4M1_7MW1Qn6JTgniOcHN_hqEWBRo

2. **16 WEST ST** (ID: p002)
   - Folder: https://drive.google.com/drive/folders/1oVXLPD0mAkX7lwi8eZrPO0uacuxmKc8y

3. **9 E. NEW ST** (ID: p001)
   - Folder: https://drive.google.com/drive/folders/1YprVgtq0VtjJINoVyfUpJUVDkJMH99lp

### Properties WITHOUT Folder IDs (Need Column K from Google Sheet - 19 properties):
- Humbert1: 408 Swarthmore Rd
- Mcfadden2: 115 Silver Ave
- Agnes1: 12 Holly Ave
- Agnes 2: 321 W. High St
- Mcfadden3: 339 Oakwood Ave
- McFadden1: 613 Whitman
- Hildebrant2: 8 Sherwood Lane
- Hildebrant1: 207 University Blvd
- Agnes 3: 52 State St
- Humbert2: 18 Wilson Ave
- Hildebrant3: 8 Fairmount Dr
- Insana1: 306 Swarthmore Rd
- Insana5: 107 Church St Apt B
- Insana4: 107 Church St Apt A
- Liscio1-3: (No address)
- Omalley1-2: (No address)

## Steps to Extract Photo File IDs

### For Each Property Folder:

1. Open the property folder in Google Drive
2. Look for a "header" subfolder (or the main photo if no subfolder)
3. Right-click on the image file
4. Click "Get link" or "Share"
5. Make sure link sharing is enabled (Anyone with the link can view)
6. Copy the link - it will look like: `https://drive.google.com/file/d/FILE_ID_HERE/view?usp=sharing`
7. Extract just the FILE_ID from the URL

### Quick Method:
- Open the image in Drive
- Look at the URL bar
- The FILE_ID is between `/d/` and `/view`
- Example: `drive.google.com/file/d/**1ABC123xyz**/view` → FILE_ID = `1ABC123xyz`

## How to Provide the Data

Create a text file or provide the mapping in this format:

```javascript
{
  "17j6Q4M1_7MW1Qn6JTgniOcHN_hqEWBRo": "FILE_ID_FOR_4_SILVER_AVE_HEADER",
  "1oVXLPD0mAkX7lwi8eZrPO0uacuxmKc8y": "FILE_ID_FOR_16_WEST_ST_HEADER",
  "1YprVgtq0VtjJINoVyfUpJUVDkJMH99lp": "FILE_ID_FOR_9_E_NEW_ST_HEADER",
  // Add more as you find them from the Google Sheet
}
```

## Alternative: Quick Update Method

If you can access the Google Sheet (Column K) and get all the folder IDs:

1. Open https://docs.google.com/spreadsheets/d/1LJYK6OSqnsUz8DiL8YgpqsYkgAcJCwCfh0wp-C_iiwA/edit?usp=sharing
2. Export Column K (folder IDs) along with property addresses
3. For each folder ID, follow the steps above to get the header image FILE_ID
4. Provide the complete mapping

## After You Provide the File IDs

I'll run the update script which will:
1. Convert each FILE_ID to the format: `https://lh3.googleusercontent.com/d/FILE_ID=w800-h600-c`
2. Update the RENTAL_KING_COMPLETE_DATA.json file
3. Test locally
4. Deploy to Vercel

## Notes
- **DO NOT overwrite** properties that already have real photos (we identified these)
- Only update available properties with placeholder logos
- The header image should be the main/hero image for each property listing
