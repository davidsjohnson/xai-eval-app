#!/bin/bash
PORT=${1:-7000}
shift
# Kill Port
sudo fuser -k "$PORT"/tcp
./docker.stop.sh $PORT

echo "Initializing Database ( Creating study and participant_feedback table if not exist )"
echo "Init DB"
python3 db.init.py

start_docker(){
    docker run -d -p "$PORT":"$PORT" -v "$(pwd)/database:/app/database" -v "$(pwd)/src/client:/app/client" --name appcontainer_$PORT myimage_$PORT
}

start_docker_debug_mode(){
    docker run -p "$PORT":"$PORT" -v "$(pwd)/database:/app/database" -v "$(pwd)/src/client:/app/client" --name appcontainer_$PORT -it myimage_$PORT /bin/sh
}

if [[ -z $1 ]]; then
    start_docker
elif [[ $1 == "debug" ]]; then
    start_docker_debug_mode
else
    start_docker
fi

echo "App Started!"
echo "URL_REFERENCE: http://0.0.0.0:$PORT?participant_id=Vx0XumYXby7ICi3X7hLpGkPP&study_id=1"
