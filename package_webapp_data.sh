#!/bin/bash

# package_data.sh
# Zips four subfolders into one archive, preserving folder structure.
# The zip file is saved in the same directory as this script.

# List your subfolders here (relative to script location)
SUBFOLDERS=("src/client/study_id_10/img" 
            "src/client/study_id_11/img"
            "src/client/study_id_50/img"
            "src/client/study_id_51/img")

# List your individual files here (relative or absolute paths)
FILES=("src/client/study_id_10/input.json"
       "src/client/study_id_11/input.json"
       "src/client/study_id_50/input.json"
       "src/client/study_id_51/input.json")

# Name of the output zip file
ZIP_NAME="webapp_data.zip"

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Change to script directory
cd "$SCRIPT_DIR" || exit 1

# Create the zip archive
zip -r "$ZIP_NAME" "${SUBFOLDERS[@]}" "${FILES[@]}"

echo "Created $ZIP_NAME in $SCRIPT_DIR"