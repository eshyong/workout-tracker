#!/bin/bash

set -eux -o pipefail

# Export environment variables file
source ./env_vars

# Update apt repos
apt-get update

# Install git, nodejs, and npm
apt-get --yes install git nodejs npm

# Install MySQL 5.6
debconf-set-selections <<< "mysql-server mysql-server/root_password password $MYSQL_ROOT_PW"
debconf-set-selections <<< "mysql-server mysql-server/root_password_again password $MYSQL_ROOT_PW"
apt-get --yes install mysql-server-5.6

# Alias "node" to "nodejs"
ln -sf /usr/bin/nodejs /usr/local/bin/node
