#!/bin/bash

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
client_dir="$script_dir/../src/client"
tmp_dir="$script_dir/../tmp"
ids=(10 11 12 21 31 41 51 61 71)

echo "Setting up subphase directories in $client_dir"
for id in "${ids[@]}"; do
    src="$client_dir/study_id_$id"


    if [[ "$id" -eq 10 || "$id" -eq 11 ]]; then
        # for tutorial and main data of no_AI study, both have no suffixes
        suffixes=(-1)

        # check that tmp source exists before continuing
        tmp_src="$tmp_dir/study_id_${id}"
        if [[ ! -d "$tmp_src" ]]; then
            echo "Skipping missing tmp source: ${tmp_src}"
            continue
        fi

    else
        suffixes=(1 2)

        # check that both tmp sources exist before continuing
        tmp_src="$tmp_dir/study_id_${id}1"
        if [[ ! -d "$tmp_src" ]]; then
            echo "Skipping missing tmp source: ${tmp_src}1"
            continue
        fi
        tmp_src="$tmp_dir/study_id_${id}2"
        if [[ ! -d "$tmp_src" ]]; then
            echo "Skipping missing tmp source: ${tmp_src}2"
            continue
        fi
    fi


    for suffix in "${suffixes[@]}"; do

        if [[ "$suffix" -eq -1 ]]; then
            dest="$client_dir/study_id_${id}"
        else
            dest="$client_dir/study_id_${id}${suffix}"
        fi

        # if destination exists, skip this id entirely (do not modify or remove)
        if [[ ! -d "$src" ]]; then
            echo "Missing source: $src — skipping code copy id $id"
        elif [[ -e "$dest" ]]; then
            echo "Destination exists: $dest — skipping code copy id $id"
        else
            echo "Setting up subphase directory: $dest"
            cp -a "$src" "$dest" || { echo "Failed copying $src -> $dest"; continue; }
        fi
        
        # always replace img/ and input.json in the copied directory
        # remove old img folder and input.json from the copy
        rm -rf "$dest/img"
        rm -f "$dest/input.json"

        # copy new img and input.json from tmp/study_id_$id
        if [[ "$suffix" -eq -1 ]]; then
            tmp_src="$tmp_dir/study_id_${id}"
        else
            tmp_src="$tmp_dir/study_id_${id}${suffix}"
        fi

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