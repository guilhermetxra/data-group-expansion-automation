# Data Group Expansion Automation

## Overview

This project automates the expansion of grouped records in Google Sheets using Google Apps Script.

The original operation was structured around a fixed number of records per group. A new requirement demanded that every group contain six records while preserving the existing operational structure.

Instead of manually adjusting thousands of rows, the process was automated to ensure consistency, scalability and data integrity.

---

## Business Challenge

The dataset was organized into groups identified by a common key.

Each group could contain a different number of records, but all groups needed to be standardized to six records.

The solution had to:

- Preserve existing data.
- Maintain record order.
- Avoid modifying valid information.
- Add only the missing records.
- Scale efficiently for large datasets.

---

## Solution

The script performs the following steps:

1. Reads all spreadsheet data into memory.
2. Identifies groups based on a shared identifier.
3. Preserves all original records.
4. Calculates how many records are missing.
5. Creates only the necessary rows.
6. Writes the final result back to the spreadsheet in a single operation.

This approach prevents row-shifting issues and improves performance when processing large spreadsheets.

---

## Technologies

- JavaScript
- Google Apps Script
- Google Sheets

---

## Results

- Reduced manual work.
- Increased operational reliability.
- Improved scalability.
- Eliminated repetitive spreadsheet adjustments.

---

## Example

### Before

| Group | Data |
|---------|---------|
| A | Value |
| A | Value |
| A | Value |

### After

| Group | Data |
|---------|---------|
| A | Value |
| A | Value |
| A | Value |
| A | |
| A | |
| A | |

---

## Author

Guilherme Teixeira
