# Rental King Properties - Data Analysis Summary

**Date:** October 16, 2025
**Project:** Rental King Property Management System

## Overview

This document summarizes the comprehensive data analysis performed on the Rental King properties portfolio, including data extraction from Google Sheets, photo folder mapping from Google Drive, and coordinate gathering from Google Maps.

---

## Data Sources

1. **Google Sheet:** [Rental King Properties Spreadsheet](https://docs.google.com/spreadsheets/d/1LJYK6OSqnsUz8DiL8YgpqsYkgAcJCwCfh0wp-C_iiwA/edit?usp=sharing)
2. **Google Drive:** [Rentals Photo Folder](https://drive.google.com/drive/folders/1fyBsLUtWX5ws44skELCEIVIJzmTB8U6C)
3. **Google Maps:** Used for coordinate extraction

---

## Key Statistics

- **Total Properties:** 42
- **Properties with Coordinates:** 4 (verified via Google Maps)
  - 1 SILVER AVE (from Sheet)
  - 127 STATE ST (manually verified)
  - 101 E. NEW ST (manually verified)
  - 110 STATE ST (manually verified)
- **Properties Missing Coordinates:** 38
- **Properties with Photo Folders:** 42 (100%)
- **Unique Photo Folders in Drive:** 46
- **Unmatched Photo Folders:** 7

---

## Property Status Breakdown

- **Available:** 22 properties
- **Rented:** 14 properties
- **Coming Soon:** 3 properties
  - 503 N. MAIN ST (Commercial)
  - 42 MONROE ST (Swedesboro)
  - 7 SPANISH OAK CT (Turnersville)

---

## Geographic Distribution

### Glassboro, NJ (Primary Location)
39 properties located in Glassboro

### Other Locations
- **Swedesboro, NJ:** 1 property (42 MONROE ST)
- **Turnersville, NJ:** 1 property (7 SPANISH OAK CT)

---

## Photo Folder Mapping

### Successfully Matched Folders (39)
All main properties have been successfully matched to their corresponding photo folders in Google Drive.

### Unmatched Photo Folders (7)
These folders exist in Google Drive but don't have corresponding property entries:

1. **10 HORSESHOE** - Possible future listing
2. **24-26 NORTH ACADEMY** - Possible multi-unit property
3. **25 SOUTH MAIN** - Possible future listing
4. **111 EAST NEW** - Possible archived property
5. **125 NORTH DELSEA** - Possible future listing
6. **511 SOUTH DELSEA** - Possible future listing
7. **PROP PICS** - General property photos folder

---

## Coordinates Data

### Verified Coordinates (4 properties)

| Property ID | Address | Latitude | Longitude | Source |
|------------|---------|----------|-----------|--------|
| P026 | 1 SILVER AVE | 39.71344715 | -75.11292559 | Google Sheet |
| P028 | 127 STATE ST | 39.7060528 | -75.1106992 | Google Maps |
| P025 | 101 E. NEW ST | 39.7053346 | -75.1094006 | Google Maps |
| P010 | 110 STATE ST | 39.7056103 | -75.1097153 | Google Maps |

### Properties Needing Coordinates (38)
The remaining 38 properties require coordinate extraction from Google Maps. Each can be searched using the pattern:
```
https://www.google.com/maps/search/[ADDRESS]+Glassboro+NJ
```

Then extract coordinates from the URL in the format: `@latitude,longitude`

---

## Special Cases

### Multi-Unit Properties
Several apartment buildings share the same photo folder ID:

- **107 E. NEW ST** (Apartments A & B) - P035, P036
- **109 E. NEW ST** (Apartments A & B) - P037, P038
- **MIDWAY RD** - Multiple properties share folder: P034, P039

### New Construction Properties
Three properties are marked as "New Construction Coming Fall 2027":
- 38 CARPENTER ST (Sorority Row) - P031
- 42 CARPENTER ST (Sorority Row) - P032
- 46 CARPENTER ST (Sorority Row) - P033
- MIDWAY RD (Reserve Now) - P034

---

## Files Generated

1. **RENTAL_KING_COMPLETE_DATA.json** - Comprehensive JSON file with all property data including:
   - Property IDs and addresses
   - Beds, baths, rent, sqft
   - Photo folder IDs and URLs
   - Coordinates (where available)
   - Status and property types
   - Parking information

2. **property-mapping-data.json** - Initial mapping document created during analysis

3. **Rental-King-Properties---listings-from-master-complete.csv** - Downloaded CSV from Google Sheets

---

## Recommendations

### Immediate Actions

1. **Complete Coordinate Collection**
   - Use Google Maps Geocoding API for batch processing
   - Or manually search each of the 38 remaining properties
   - Store coordinates in the Google Sheet for future reference

2. **Investigate Unmatched Folders**
   - Review the 7 unmatched photo folders
   - Determine if they represent future listings or should be archived
   - Consider adding them to the spreadsheet if they're active properties

3. **Standardize Data Entry**
   - Some properties are missing beds/baths data
   - Ensure all rented properties have complete information
   - Standardize address formatting (e.g., "E." vs "EAST", "ST" vs "STREET")

### Data Quality Improvements

1. **Add Missing Information**
   - Several properties have null values for beds, baths, or rent
   - Complete the data for properties P027, P029, P030

2. **Photo Folder Organization**
   - Consider creating a naming convention for photo folders
   - Ensure all folder names match property addresses consistently

3. **Map Integration**
   - Once all coordinates are collected, create an interactive map
   - Display available vs rented properties visually
   - Add property details on map markers

---

## Technical Notes

### Google Maps Coordinate Extraction
Coordinates can be extracted from Google Maps URLs using this pattern:
```
https://www.google.com/maps/place/ADDRESS/@LATITUDE,LONGITUDE,17z/...
```

Example:
```
https://www.google.com/maps/place/127+State+St/@39.7060528,-75.1106992,17z/...
                                              ^^^^^^^^^^  ^^^^^^^^^^^
                                              Latitude    Longitude
```

### Photo Folder ID Format
Google Drive folder IDs are alphanumeric strings like:
```
1QVTUs88c41PoudjYPtQK2EuJS5bjkmpr
```

Access pattern:
```
https://drive.google.com/drive/folders/[FOLDER_ID]
```

---

## Contact Information

For questions about this data analysis or to request updates, please refer to the source files:
- `/Users/mszwed9696/rental_king/RENTAL_KING_COMPLETE_DATA.json`
- `/Users/mszwed9696/rental_king/property-mapping-data.json`

---

**Analysis Completed:** October 16, 2025
**Generated by:** Claude Code Assistant
