#!/bin/bash
PORT=${1:-7000}
# Kill Port
sudo fuser -k "$PORT"/tcp
cd app_live
./run.docker.sh "$PORT"
