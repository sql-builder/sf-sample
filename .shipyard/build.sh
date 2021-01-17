#!/bin/bash

set -e

TAR_DIR="node-${NODE_VERSION}-linux-x64"
TAR_NAME="${TAR_DIR}.tar.gz"

pushd ${HOME}

curl -L -o "${TAR_NAME}" "https://nodejs.org/dist/${NODE_VERSION}/${TAR_NAME}"

tar -xf "${TAR_NAME}"

mkdir -p "${HOME}/.local"
ln -f -s "${HOME}/${TAR_DIR}" "${HOME}/.local/node"

popd

npm install -g @dataform/cli

printf "which dataform: " && which dataform && printf "path.\n" 

printf "Dataform version: " &&  dataform --version && printf ".\n" 

cd /home/shipyard/

# Pulling gpg credentials 
gpg --quiet --batch --yes --decrypt --passphrase="${CREDENTIALS_GPG_PASSPHRASE}" --output  /home/shipyard/df-credentials.json /home/shipyard/.df-credentials.json.gpg

# Running an init set of commands. 
dataform install

dataform compile

dataform run --dry-run

dataform test