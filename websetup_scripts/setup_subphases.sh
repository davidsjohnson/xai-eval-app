#!/bin/bash

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
client_dir="$script_dir/../src/client"
tmp_dir="$script_dir/../tmp"
ids=(12 21 31 41 51)

echo "Setting up subphase directories in $client_dir"
for id in "${ids[@]}"; do
    src="$client_dir/study_id_$id"
    if [[ ! -d "$src" ]]; then
        echo "Skipping missing source: $src"
        continue
    fi

    # check that both tmp sources exist before continuing
    tmp_src="$tmp_dir/study_id_${id}1"
    if [[ ! -d "$tmp_src" ]]; then
        echo "Skipping missing tmp source: $tmp_src"
        continue
    fi
    tmp_src="$tmp_dir/study_id_${id}2"
    if [[ ! -d "$tmp_src" ]]; then
        echo "Skipping missing tmp source: $tmp_src"
        continue
    fi

    for suffix in 1 2; do
        dest="$client_dir/study_id_${id}${suffix}"

        # if destination exists, skip this id entirely (do not modify or remove)
        if [[ -e "$dest" ]]; then
            echo "Destination exists: $dest — skipping id $id"
            continue 2
        fi
        cp -a "$src" "$dest" || { echo "Failed copying $src -> $dest"; continue; }

        # remove old img folder and input.json from the copy
        rm -rf "$dest/img"
        rm -f "$dest/input.json"

        # copy new img and input.json from tmp/study_id_$id
        tmp_src="$tmp_dir/study_id_${id}${suffix}"
        if [[ -d "$tmp_src/img" ]]; then
            cp -a "$tmp_src/img" "$dest/"
        else
            echo "No tmp img for $id at $tmp_src/img"
        fi

        if [[ -f "$tmp_src/input.json" ]]; then
            cp -f "$tmp_src/input.json" "$dest/"
        else
            echo "No tmp input.json for $id at $tmp_src/input.json"
        fi
    done
done