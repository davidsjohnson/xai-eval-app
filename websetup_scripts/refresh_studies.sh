#! /bin/bash

# Optional flag (5th arg) to control adding study to DB: use --no-db or -n to skip DB insert
add_to_db=1
if [[ -n "$1" ]]; then
    case "$1" in
        --no-db|-n) add_to_db=0 ;;
        --add-db|--with-db|--yes) add_to_db=1 ;;
        *) echo "Warning: unknown option '$1' (expected --no-db). Ignoring." ;;
    esac
fi

if [[ $add_to_db == 0 ]]; then
    echo "Skipping DB insert as requested (--no-db)."
    skip_arg="-n"
else
    echo "DB insert enabled (default)."
    skip_arg=""
fi


# change working directory to the parent of the script's directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/.." || { echo "Failed to change directory to parent of script dir" >&2; exit 1; }

# unzip all the study data zips (skipping existing dirs)
./websetup_scripts/unzip_studydata.sh

# setup study data in tmp/
rm -rf tmp
mkdir -p tmp 
./websetup_scripts/csv2webapp.sh 121 1 study_data/no_XAI/main_data/input_examples_phase1.csv study_data/no_XAI/main_data/images_phase1 $skip_arg
./websetup_scripts/csv2webapp.sh 122 1 study_data/no_XAI/main_data/input_examples_phase2.csv study_data/no_XAI/main_data/images_phase2 $skip_arg

./websetup_scripts/csv2webapp.sh 211 2 study_data/saliency_xai2/main_data/input_examples_phase1.csv study_data/saliency_xai2/main_data/images_phase1 $skip_arg
./websetup_scripts/csv2webapp.sh 212 2 study_data/saliency_xai2/main_data/input_examples_phase2.csv study_data/saliency_xai2/main_data/images_phase2 $skip_arg

./websetup_scripts/csv2webapp.sh 311 3 study_data/example_based/main_data/input_examples_phase1.csv study_data/example_based/main_data/images_phase1 $skip_arg
./websetup_scripts/csv2webapp.sh 312 3 study_data/example_based/main_data/input_examples_phase2.csv study_data/example_based/main_data/images_phase2 $skip_arg

./websetup_scripts/csv2webapp.sh 411 4 study_data/cf_based/main_data/input_examples_phase1.csv study_data/cf_based/main_data/images_phase1 $skip_arg
./websetup_scripts/csv2webapp.sh 412 4 study_data/cf_based/main_data/input_examples_phase2.csv study_data/cf_based/main_data/images_phase2 $skip_arg

./websetup_scripts/csv2webapp.sh 511 5 study_data/concept_based/main_data/input_examples_phase1.csv study_data/concept_based/main_data/images_phase1 $skip_arg
./websetup_scripts/csv2webapp.sh 512 5 study_data/concept_based/main_data/input_examples_phase2.csv study_data/concept_based/main_data/images_phase2 $skip_arg

# setup subphase directories in src/client/
./websetup_scripts/setup_subphases.sh