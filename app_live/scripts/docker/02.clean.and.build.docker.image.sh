echo "Stop old docker instance with name mycontainer"
docker stop mycontainer

echo "Delete old docker instance with name mycontainer"
docker rm mycontainer

echo "Delete old docker image with name myimage"
docker rmi myimage

echo "Building Image from Docker File"
docker build -t myimage .
