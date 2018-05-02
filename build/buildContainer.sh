#!/bin/bash

VERSION=`git describe --tags --always`
echo Building version $VERSION

docker build -t nerc/terraform-state-backend:latest --build-arg CONTAINER_IMAGE_VERSION=$VERSION .
docker tag nerc/terraform-state-backend:latest nerc/terraform-state-backend:$VERSION

echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
docker push nerc/terraform-state-backend:latest
docker push nerc/terraform-state-backend:$VERSION
