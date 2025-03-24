#!/bin/bash
PORT=7000
# Kill Port
sudo fuser -k "$PORT"/tcp
cd app_live
./run.docker.sh
