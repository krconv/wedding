#!/bin/sh

if ! type docker >/dev/null 2>&1 && ! type poetry >/dev/null 2>&1; then
    echo "Docker nor poetry are installed, aborting..."
    exit 1
fi
cd "$(dirname $(dirname $(readlink -f "$0")))" # cd to root directory
ls
if [ -d deploy ]; then
    echo "Cleaning the deploy directory..."
    rm -rf deploy/*
else
    echo "Creating the deploy directory..."
    mkdir deploy
fi

# Copy the web assets
if [ ! -d web/build ]; then
    if ! type yarn >/dev/null 2>&1; then
        echo "Yarn is not installed and the web assets haven't been built, aborting..."
        exit 1
    fi

    echo "Building the web assets..."
    yarn --cwd web build
fi
echo "Bundling the the web assets..."
mkdir -p deploy/web && cp -r web/build deploy/web

# Copy the API code
echo "Bundling the the API code..."
if type poetry >/dev/null 2>&1; then
    (cd api && poetry export --without-hashes --output requirements.txt)
else
    docker run --volume $(pwd)/api:/api --workdir /api --rm docker.io/acidrain/python-poetry:3.10 poetry export --without-hashes --output requirements.txt
fi
cp -r api deploy/
cp api/requirements.txt deploy/

# Copy the deploy config
echo "Bundling the the deploy config..."
cp .googlecloud/.gcloudignore .googlecloud/app.yaml deploy/

echo "Done!"
