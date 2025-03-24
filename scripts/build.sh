#!/bin/bash
#img folder and input.json should be in app_live/client/ui/study directory
#the place where the page is served from
#
usage()
{
    echo "usage: ./run.app <n.img> <csv>"
    echo
    echo "    n.img : Number of image cards in the web page"
    echo "    csv   : Input CSV file with x-ray image, patient id, true diag, suggested diag information "
    echo
    exit 1
}

[[ -z "$1" ]] && usage
[[ -z "$2" ]] && usage

input_csv="$2"
rm -rf app_live > /dev/null 2>&1
mkdir app_live
cp -rf src/* app_live/

# Clean unnessary files from src
rm -rf src/database > /dev/null 2>&1
rm -rf src/node_modules > /dev/null 2>&1
rm -rf src/data > /dev/null 2>&1
rm src/package-lock.json > /dev/null 2>&1


# Remove Unnessary Files from app_live
rm -rf app_live/node_modules > /dev/null 2>&1
rm -rf app_live/client/ui/study > /dev/null 2>&1
rm -rf app_live/database > /dev/null 2>&1
rm app_live/package-lock.json > /dev/null 2>&1

mkdir -p app_live/client/ui/study

#database in the base ( not in app_live )
mkdir -p database

#client WebApp
cp -rf input/img  app_live/client/ui/study/

if [[ "$1" == 1 ]]; then
    cp src/client/ui/study/1/*   app_live/client/ui/study/
fi

if [[ "$1" == 2 ]]; then
    cp src/client/ui/study/2/*   app_live/client/ui/study/
fi

if [[ "$1" == 3 ]]; then
    cp src/client/ui/study/3/*   app_live/client/ui/study/
fi

if [[ "$1" == 4 ]]; then
    cp src/client/ui/study/4/*   app_live/client/ui/study/
fi

python3 app_live/scripts/csv2json.py "$input_csv" app_live/client/ui/study/input.json
cat app_live/client/ui/study/input.json
#python3 "${VIKI_UTILITIES_DIR}"/run.py "$@"

cd app_live
./build.docker.sh
