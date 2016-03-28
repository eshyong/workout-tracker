#!/bin/bash

# Source environment variables file
source ./env_vars

# Turn on the following flags
# -e: terminate script on error
# -u: terminate script on unbound variable
# -x: log each line of the script as it is executed
# -o pipefail: sets the exit status of a pipe to the last
#   command that returned a non-zero status
set -eux -o pipefail

# Update apt repos
apt-get update

# Install git, nodejs, and npm
apt-get --yes install git nodejs npm

# Install node/npm 5.6.0
npm install --global n
n 5.6.0
ln -sf /usr/local/n/versions/node/5.6.0/bin/npm /usr/local/bin/npm
ln -sf /usr/local/n/versions/node/5.6.0/bin/node /usr/local/bin/node

# Install nodemon and webpack globally
npm install --global nodemon webpack
ln -sf /usr/local/n/versions/node/5.6.0/bin/nodemon /usr/local/bin/nodemon
ln -sf /usr/local/n/versions/node/5.6.0/bin/webpack /usr/local/bin/webpack

# Install MySQL 5.6
debconf-set-selections <<< "mysql-server mysql-server/root_password password $MYSQL_ROOT_PW"
debconf-set-selections <<< "mysql-server mysql-server/root_password_again password $MYSQL_ROOT_PW"
apt-get --yes install mysql-server-5.6
