#!/bin/bash
PORT=7000
#Kill The Application using Port
sudo fuser -k "$PORT"/tcp
node server/server.js &
echo "Server running at http://localhost:$PORT"

