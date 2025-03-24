#!/bin/bash
WORK_PATH='/peter/projects/devops-backend'
cd $WORK_PATH
echo "clear old code"
git reset --hard origin/main
git clean -f
echo "pull new code"
git pull origin main
echo "start building"
docker build -t devops-backend:1.0 .
echo "stop old container and remove"
docker stop devops-backend-container
docker rm devops-backend-container
echo "start a new container"
docker container run -p 3000:3000 --name devops-backend-container -d devops-backend:1.0