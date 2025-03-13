#move to the parent directory of app_live directory
cd ../

#(DEBUG)Interactive Mode ( You need to start the server manually : node server/server.js )
#docker run -p 7000:7000 --name mycontainer -it myimage /bin/sh

#(DEBUG) Interactive Mode ( You need to start the server manually : node server/server.js )
#Interactive with database on host
#docker run -p 7000:7000 -v $(pwd)/database:/app/database --name mycontainer -it myimage /bin/sh

#Non Interactive Mode ( DB in Docker )
#docker run -d -p 7000:7000 --name mycontainer myimage

#Non Interactive Mode ( DB in Host - Shared DB )
docker run -d -p 7000:7000 -v $(pwd)/database:/app/database --name mycontainer myimage

echo "App Started!"
echo "URL_REFERNCE: http://0.0.0.0:7000?participant_id=123&study_id=456"
