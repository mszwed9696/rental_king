# Google Drive Photo File ID Extraction Guide

## Overview
This guide provides instructions for extracting actual Google Drive **file IDs** for property header photos from the Rental King Properties Google Drive.

## Current Status
- **Total Properties**: 41
- **Extracted**: 2
- **Remaining**: 39

## Already Extracted IDs

```json
{
  "P026": "10l60uUO6Sv7yS6xLysCeN0hC1c07siCk",  // 1 SILVER AVE
  "P028": "1hWwdViw340dTg61LfHOFbflttapQz7ob"   // 127 STATE ST
}
```

## Understanding the Structure

The current `property_status_photo_mapping.json` file contains **folder IDs** (pointing to Header folders), not file IDs. We need to extract the actual **image file IDs** from inside those folders.

### Current Structure (Folder IDs):
```json
{
  "P026": {
    "address": "1 SILVER AVE",
    "photo_column_k": "1QVTUs88c41PoudjYPtQK2EuJS5bjkmpr"  // <- This is a FOLDER ID
  }
}
```

### Target Structure (File IDs):
```json
{
  "P026": "10l60uUO6Sv7yS6xLysCeN0hC1c07siCk"  // <- This is the actual IMAGE FILE ID
}
```

## Extraction Process

### Manual Method (For Each Property)

1. **Navigate to Header Folder**
   ```
   https://drive.google.com/drive/folders/{photo_column_k}
   ```

2. **Find the First Image**
   - Look for the first `.png` or `.jpg` file in the folder

3. **Open in New Tab**
   - Double-click the image file to open the viewer
   - Click "More actions" (three dots)
   - Select "Open in new tab"

4. **Extract File ID**
   - From the URL bar, copy the file ID:
   ```
   https://drive.google.com/file/d/{FILE_ID_HERE}/view
   ```

5. **Record the Mapping**
   - Add to `complete_photo_mapping.json`:
   ```json
   "P0XX": "file_id_here"
   ```

### Automated Method (Recommended)

Use the browser automation approach:

```javascript
// For each property:
1. Navigate to https://drive.google.com/drive/folders/{photo_column_k}
2. Wait for page load
3. Find first image element
4. Double-click to open viewer
5. Click "More actions" -> "Open in new tab"
6. Extract file ID from new tab URL
7. Close tab and return to folder
8. Repeat for next property
```

## Important Notes

### Duplicate Folder IDs
Several properties share the same Header folder ID:
- `1C2LhA1owWwG6A-zuJaYWI35SYgQ8sak2` is used by:
  - P034 (MIDWAY RD)
  - P039 (42 MONROE ST)
  - P035 (107 E NEW ST APT A)
  - P036 (107 E NEW ST APT B)
  - P037 (109 E NEW ST APT A)
  - P038 (109 E NEW ST APT B)

These properties will likely share the same photo file ID.

## Properties to Extract

See `extraction_plan.json` for the complete list of 39 remaining properties with their Header folder URLs.

## Final Output Format

The complete mapping should be saved to `/Users/mszwed9696/rental_king/complete_photo_mapping.json` in this format:

```json
{
  "P001": "file_id_here",
  "P002": "file_id_here",
  ...
  "P041": "file_id_here"
}
```

## Usage in Website

Once complete, this mapping will be used to display property photos using:
```
https://drive.google.com/uc?export=view&id={FILE_ID}
```

## Files Generated

1. `/Users/mszwed9696/rental_king/extraction_plan.json` - Full extraction plan
2. `/Users/mszwed9696/rental_king/complete_photo_mapping.json` - Output file (in progress)
3. `/Users/mszwed9696/rental_king/batch_extract_photo_ids.js` - Helper script
4. `/Users/mszwed9696/rental_king/EXTRACTION_GUIDE.md` - This guide

## Next Steps

1. Continue extraction manually or via automation
2. Update `complete_photo_mapping.json` as you extract each ID
3. When complete, integrate into the rental property website

## Estimated Time

- Manual: ~5-10 minutes per property = 3-6 hours total for 39 properties
- Automated: ~10-20 seconds per property = 10-15 minutes total

Automation is strongly recommended for efficiency.
