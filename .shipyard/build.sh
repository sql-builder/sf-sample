#!/bin/bash

set -e

echo "Starting new Fleet Run: " >> log_${SHIPYARD_LOG_ID}.txt
echo ${SHIPYARD_FLEET_ID} >> log_${SHIPYARD_LOG_ID}.txt
echo "Starting new Fleet Run: " >> log_${SHIPYARD_LOG_ID}.txt
echo ${SHIPYARD_VESSEL_ID} >> log_${SHIPYARD_LOG_ID}.txt
echo "\n" >> log_${SHIPYARD_LOG_ID}.txt

TAR_DIR="node-${NODE_VERSION}-linux-x64"
TAR_NAME="${TAR_DIR}.tar.gz"

pushd ${HOME}

curl -L -o "${TAR_NAME}" "https://nodejs.org/dist/${NODE_VERSION}/${TAR_NAME}"

tar -xf "${TAR_NAME}"

mkdir -p "${HOME}/.local"
ln -f -s "${HOME}/${TAR_DIR}" "${HOME}/.local/node"

popd

echo "Using Node Version: " >> log_${SHIPYARD_LOG_ID}.txt 
echo ${NODE_VERSION} >> log_${SHIPYARD_LOG_ID}.txt

npm install -g @dataform/cli

# Check
printf "Which dataform: " && which dataform

# printf "Dataform version: " &&  dataform --version 
echo 'Dataform Version: " >> log_${SHIPYARD_LOG_ID}.txt
dataform --version >> log_${SHIPYARD_LOG_ID}.txt

# Pulling gpg credentials 
printf "PWD: " && pwd

gpg --quiet --batch --yes --decrypt --passphrase="${CREDENTIALS_GPG_PASSPHRASE}" --output  .df-credentials.json .df-credentials.gpg


# Running an init set of commands. 
dataform install

echo "Starting Dataform Run...\n" >> log_${SHIPYARD_LOG_ID}.txt
dataform run --dry-run >> log_${SHIPYARD_LOG_ID}.txt

# dataform test
