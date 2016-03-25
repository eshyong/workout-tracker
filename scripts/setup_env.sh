#!/bin/bash

set -eux -o pipefail

# Export environment variables file
source ./env_vars

# Update apt repos
apt-get update

# Install git, nodejs, npm, and mysql
apt-get --yes install git
apt-get --yes install nodejs
apt-get --yes install npm
debconf-set-selections <<< "mysql-server mysql-server/root_password password $MYSQL_ROOT_PW"
debconf-set-selections <<< "mysql-server mysql-server/root_password_again password $MYSQL_ROOT_PW"
apt-get --yes install mysql-server

# Alias "node" to "nodejs"
ln -s /usr/bin/nodejs /usr/local/bin/node
