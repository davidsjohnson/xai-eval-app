docker run -d \
    -p 7000:7000 \
    -v $(pwd)/data:/data \
    --name mycontainer myimage

echo "Open App in Browser:"
echo "http://0.0.0.0:7000"
