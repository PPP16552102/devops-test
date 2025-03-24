#!/bin/bash
WORK_PATH='/peter/projects/devops-front-react'
cd $WORK_PATH
echo "clear old code"
git reset --hard origin/main
git clean -f
echo "pull new code"
git pull origin main
echo "compiling..."
npm run build
echo "start building"
docker build -t devops-front:1.0 .
echo "stop old container and remove"
docker stop devops-front-container
docker rm devops-front-container
echo "start a new container"
docker container run -p 80:80 --name devops-front-container -d devops-front:1.0