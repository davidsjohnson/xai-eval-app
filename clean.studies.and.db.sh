echo
echo
echo
echo "Warning !! This script is going to delete database and all the studies related data"
echo
echo
echo
read -p "Do you really want to continue? [Y/y] : " choice
if [[ $choice == "y" || $choice == "Y" ]]; then
    echo
    echo "Processing clean routine"
    echo
    echo "Cleaning DB"
    [ -f database/database.db ] && rm -rf database/database.db 2> /dev/null
    echo "Cleaning APP Data"
    find ./src/client -type d -name 'study_id_*' ! -name 'study_template' -print0 | xargs -0 rm -r 2> /dev/null
    echo
else
    exit 1
fi


