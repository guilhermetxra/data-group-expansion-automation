# Data Group Expansion Automation

## Overview

This project automates the standardization of grouped records in Google Sheets using Google Apps Script.

The original operation was structured around a smaller number of records per group. A new requirement demanded that every group contain six records while preserving the existing operational structure and data organization.

Instead of manually adjusting thousands of rows, the process was automated to improve consistency, scalability, and data integrity.

---

## Business Challenge

The dataset was organized into groups identified by a common key.

Each group could contain a different number of records, but all groups needed to be standardized to six records without altering the original information.

The solution had to:

* Preserve existing records.
* Maintain record order.
* Avoid modifying valid information.
* Add only the missing records.
* Scale efficiently for large datasets.
* Ensure data integrity after processing.

---

## Solution

The project is divided into two complementary stages.

### 1. Group Expansion

Responsible for identifying grouped records and automatically expanding them until they reach the required quantity.

Main file:

`src/completarRegistrosPorGrupo.js`

Features:

* Reads spreadsheet data into memory.
* Identifies records belonging to the same group.
* Preserves existing information.
* Inserts only the missing records.
* Updates the spreadsheet in a single operation.

### 2. Data Integrity Validation

Responsible for validating the processed dataset after expansion.

Main file:

`src/validarIntegridade.js`

Validation checks:

* Header consistency.
* Group count verification.
* Record order preservation.
* Original data comparison.
* Detection of missing or duplicated records.
* Validation of newly inserted rows.

Together, these modules create a complete workflow for data transformation and integrity verification.

---

## Workflow

Original Dataset

↓

Group Expansion

↓

Processed Dataset

↓

Integrity Validation

↓

Final Verification

---

## Technologies

* JavaScript
* Google Apps Script
* Google Sheets

---

## Results

* Reduced manual work.
* Increased operational reliability.
* Improved scalability.
* Eliminated repetitive spreadsheet adjustments.
* Added automated integrity validation.
* Reduced the risk of human error during data processing.

---

## Example

### Before

| Group | Data  |
| ----- | ----- |
| A     | Value |
| A     | Value |
| A     | Value |

### After

| Group | Data  |
| ----- | ----- |
| A     | Value |
| A     | Value |
| A     | Value |
| A     |       |
| A     |       |
| A     |       |

---

## Repository Structure

```text
src/
├── completarRegistrosPorGrupo.js
└── validarIntegridade.js
```

---

## Author

Guilherme Teixeira
