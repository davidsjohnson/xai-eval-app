#Kill The Application using Port
sudo fuser -k 7000/tcp 2>/dev/null 1>/dev/null
python3 -m http.server 7000 2>/dev/null 1>/dev/null &
xdg-open http://localhost:7000/ 2>/dev/null 1>/dev/null &

