#! /bin/bash

set -euo pipefail

# change working directory to the parent of the script's directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/.." || { echo "Failed to change directory to parent of script dir" >&2; exit 1; }

DIR="${1:-./study_data}"

if [ ! -d "$DIR" ]; then
    echo "Directory not found: $DIR" >&2
    exit 1
fi

command -v unzip >/dev/null || { echo "unzip is required but not installed" >&2; exit 1; }

# collect .zip files recursively
mapfile -t zips < <(find "$DIR" -type f -name '*.zip' -print)

if [ "${#zips[@]}" -eq 0 ]; then
    echo "No .zip files found in $DIR"
    exit 0
fi

for z in "${zips[@]}"; do
    # skip any paths that include this substring
    if [[ "$z" == *main_data/study_images_example.zip* ]]; then
        echo "Skipping excluded zip: $z"
        continue
    fi

    base="$(basename "$z" .zip)"
    out="$(dirname "$z")/$base"
    if [ -d "$out" ]; then
        echo "Skipping $z — target directory already exists: $out"
        continue
    fi
    echo "Unzipping $z -> $out"
    mkdir -p "$out"
    if ! unzip -q "$z" -d "$out"; then
        echo "Failed to unzip $z" >&2
        exit 1
    fi
done