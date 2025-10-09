#! /bin/bash
study_id="$1"
study_type="$2"
csv_input_file="$3"
study_image_dir="$4"
# Optional flag (5th arg) to control adding study to DB: use --no-db or -n to skip DB insert
add_to_db=1
if [[ -n "$5" ]]; then
    case "$5" in
        --no-db|-n) add_to_db=0 ;;
        --add-db|--with-db|--yes) add_to_db=1 ;;
        *) echo "Warning: unknown option '$5' (expected --no-db). Ignoring." ;;
    esac
fi

# change working directory to the parent of the script's directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/.." || { echo "Failed to change directory to parent of script dir" >&2; exit 1; }

data_dir="tmp/study_id_${study_id}"


if [[ -d $data_dir ]]; then
    echo "Error: Directory ($data_dir) already exists. Delete it and retry."
    exit 1
fi

if [[ ! -d $study_image_dir ]]; then
    echo "Error: Image directory ($study_image_dir) does not exist. Feed proper image directory for the study."
    exit 1
fi

if (( add_to_db == 1 )); then
    echo "Creating study_id record in study table"
    python3 db.create.new.study.py "$study_id" "$study_type" "$csv_input_file"
    ret=$?
    if (( ret != 0 )); then
        echo "Error: DB error -> creating study_id in study table."
        exit 1
    fi
else
    echo "Skipping DB creation as requested (--no-db)."
fi

echo "Creating temporary directory: $data_dir"
mkdir -p "$data_dir/img"

# Copy images from the study image directory to the new directory
echo "Copying images from $study_image_dir to $data_dir/img/"
cp -rf "$study_image_dir"/* "$data_dir/img/"

# Convert CSV to JSON
echo "Converting CSV to JSON: $csv_input_file"
python3 src/scripts/csv2json.py "$csv_input_file" "$data_dir/input.json"

# echo "Contents of $data_dir:"
# ls -l "$data_dir"

# echo "Contents of $data_dir/img/:"
# ls -l "$data_dir/img/"