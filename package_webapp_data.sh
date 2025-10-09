#!/bin/bash

# package_data.sh
# cleans up the database and packages specified folders and files into a zip archive.
# Zips four subfolders into one archive, preserving folder structure.

# Copy the database to a temporary file
cp database/database.db database/database_bck.db

# Delete rows from participant_feedback and access_times tables in the tmp database
sqlite3 database/database_bck.db "DELETE FROM participant_feedback;"
sqlite3 database/database_bck.db "DELETE FROM access_times;"

# Reset autoincrement counters for both tables
sqlite3 database/database_bck.db "DELETE FROM sqlite_sequence WHERE name='participant_feedback';"
sqlite3 database/database_bck.db "DELETE FROM sqlite_sequence WHERE name='access_times';"

# List your subfolders here (relative to script location)
SUBFOLDERS=("src/client/study_id_10/img" 
            "src/client/study_id_11/img"
            "src/client/study_id_12/img"
            "src/client/study_id_121/img"
            "src/client/study_id_122/img"
            "src/client/study_id_20/img"
            "src/client/study_id_21/img"
            "src/client/study_id_211/img"
            "src/client/study_id_212/img"
            "src/client/study_id_30/img"
            "src/client/study_id_31/img"
            "src/client/study_id_311/img"
            "src/client/study_id_312/img"
            "src/client/study_id_40/img"
            "src/client/study_id_41/img"
            "src/client/study_id_411/img"
            "src/client/study_id_412/img"
            "src/client/study_id_50/img"
            "src/client/study_id_51/img"
            "src/client/study_id_511/img"
            "src/client/study_id_512/img")

# List your individual files here (relative or absolute paths)
FILES=("src/client/study_id_10/input.json"
       "src/client/study_id_11/input.json"
       "src/client/study_id_12/input.json"
       "src/client/study_id_121/input.json"
       "src/client/study_id_122/input.json"
       "src/client/study_id_20/input.json"
       "src/client/study_id_21/input.json"
       "src/client/study_id_211/input.json"
       "src/client/study_id_212/input.json"
       "src/client/study_id_30/input.json"
       "src/client/study_id_31/input.json"
       "src/client/study_id_311/input.json"
       "src/client/study_id_312/input.json"
       "src/client/study_id_40/input.json"
       "src/client/study_id_41/input.json"
       "src/client/study_id_411/input.json"
       "src/client/study_id_412/input.json"
       "src/client/study_id_50/input.json"
       "src/client/study_id_51/input.json"
       "src/client/study_id_511/input.json"
       "src/client/study_id_512/input.json")

# Name of the output zip file
ZIP_NAME="webapp_data.zip"

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Change to script directory
cd "$SCRIPT_DIR" || exit 1

# Create the zip archive
zip -r "$ZIP_NAME" "${SUBFOLDERS[@]}" "${FILES[@]}"

# # Add the cleaned database to the zip, excluding the original database file
zip "$ZIP_NAME" "database/database_bck.db" -x "database/database.db"
zipnote -w "$ZIP_NAME" < <(echo "@ database/database_bck.db"; echo "@=database/database.db"; echo ".")

# Remove the temporary database backup
rm "database/database_bck.db"

echo "Created $ZIP_NAME in $SCRIPT_DIR"