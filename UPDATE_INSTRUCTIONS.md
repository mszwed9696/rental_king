# Safe Property Update Instructions

## ⚠️ IMPORTANT: Photo Protection

Your property photos work because `RENTAL_KING_COMPLETE_DATA.json` contains **actual image file IDs**, not folder IDs.

The Google Sheet only has **folder IDs** which break the photos (404 errors).

**NEVER** run `convert_csv_to_json.js` or any script that overwrites photo URLs!

---

## How to Safely Update Property Information

### Step 1: Export Google Sheet to CSV

1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/1LJYK6OSqnsUz8DiL8YgpqsYkgAcJCwCfh0wp-C_iiwA/edit
2. Go to **File** → **Download** → **Comma Separated Values (.csv)**
3. Save it as `property_data_new.csv` in the `/Users/mszwed9696/rental_king/` folder

### Step 2: Run the Safe Update Script

```bash
cd /Users/mszwed9696/rental_king
node safe_update_from_csv.js
```

This script will:
- ✅ Update rent prices, availability, beds/baths, parking
- ✅ Update addresses, coordinates, lease start dates
- ✅ **PRESERVE all working photo URLs** (never touches them!)
- ✅ Create automatic backup before updating

### Step 3: Test Locally

```bash
npm run dev
```

Visit http://localhost:3000 and verify:
- Property information is updated correctly
- **Photos still display** (most important!)

### Step 4: Deploy to Production

```bash
git add RENTAL_KING_COMPLETE_DATA.json
git commit -m "Update property data (safe update - photos preserved)"
git push origin main
```

Vercel will automatically deploy in ~2-3 minutes.

---

## What Each Script Does

### ✅ SAFE TO USE:
- **`safe_update_from_csv.js`** - Updates property info, preserves photos
- **`add_coordinates.js`** - Only updates coordinates
- **`update_parking.js`** - Only updates parking info

### ❌ DANGEROUS - DO NOT USE:
- **`convert_csv_to_json.js`** - Overwrites entire file including photos ⛔
- **`fetch_drive_photos_simple.js`** - Replaces working photo URLs ⛔
- **`sync_properties_from_csv.js`** - May overwrite photos ⛔

---

## Manual Updates (Alternative)

If you need to update just a few properties manually:

1. Open `RENTAL_KING_COMPLETE_DATA.json`
2. Find the property by searching for the address
3. Update fields like `rent`, `status`, `beds`, etc.
4. **DO NOT touch** `photoUrl` or `photoUrlBackup` fields!
5. Save the file
6. Test locally, then deploy

---

## If Photos Ever Break Again

If photos stop showing after an update:

```bash
# Restore from the last backup
cp RENTAL_KING_COMPLETE_DATA.backup.[LATEST_TIMESTAMP].json RENTAL_KING_COMPLETE_DATA.json

# Or restore from git history
git show 7aed0d9:RENTAL_KING_COMPLETE_DATA.json > RENTAL_KING_COMPLETE_DATA.json
```

Commit: `7aed0d9` has the known-working photo file IDs.

---

## Adding Photos for New Properties

If you add new properties to the Google Sheet, their photos won't work automatically.

You'll need to:
1. Navigate to the property's Google Drive folder
2. Open the first image
3. Get the **file ID** from the URL (not the folder ID!)
4. Add it to the property in `RENTAL_KING_COMPLETE_DATA.json`:

```json
{
  "id": "NewProperty1",
  "address": "123 NEW STREET",
  ...
  "photo_folder_id": "FOLDER_ID_HERE",
  "photoUrl": "https://lh3.googleusercontent.com/d/ACTUAL_FILE_ID_HERE=w800-h600-c",
  "photoUrlBackup": "https://drive.google.com/file/d/ACTUAL_FILE_ID_HERE/preview"
}
```

---

## Questions?

Contact the developer or refer to:
- Working commit: `7aed0d9`
- This file: `UPDATE_INSTRUCTIONS.md`
