#!/bin/bash
PORT=${1:-7000}
CONTAINER="appcontainer_${PORT}"
docker stop "$CONTAINER"
docker rm "$CONTAINER"
sudo fuser -k "${PORT}/tcp"
