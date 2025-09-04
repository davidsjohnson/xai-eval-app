#!/bin/bash
PORT=7000
# Kill Port
sudo fuser -k "$PORT"/tcp
./docker.stop.sh

echo "Initializing Database ( Creating study and participant_feedback table if not exist )"
echo "Init DB"
python3 db.init.py

start_docker(){
    docker run -d -p 7000:7000 -v $(pwd)/database:/app/database -v $(pwd)/src/client:/app/client --name mycontainer myimage
}

start_docker_debug_mode(){
    docker run -p 7000:7000 -v $(pwd)/database:/app/database -v $(pwd)/src/client:/app/client -name mycontainer -it myimage /bin/sh
}

if [[ -z $1 ]]; then
    start_docker
elif [[ $1 == "debug" ]]; then
    start_docker_debug_mode
else
    start_docker
fi

echo "App Started!"
echo "URL_REFERNCE: http://0.0.0.0:7000?participant_id=Vx0XumYXby7ICi3X7hLpGkPP&study_id=1"
