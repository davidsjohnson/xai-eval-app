#!/bin/bash
PORT=${1:-7000}

echo "Stop old docker instance with name appcontainer_$PORT"
docker stop appcontainer_$PORT

echo "Delete old docker instance with name appcontainer_$PORT"
docker rm appcontainer_$PORT

echo "Delete old docker image with name myimage_$PORT"
docker rmi myimage_$PORT

echo "Building Image from Docker File"
docker build --no-cache -t myimage_$PORT . --build-arg PORT=$PORT
