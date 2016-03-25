#!/bin/bash

set -eux -o pipefail

# Export environment variables file
source ./env_vars

# Update apt repos
sudo apt-get update

# Install git, nodejs, npm, and mysql
sudo apt-get --yes install git
sudo apt-get --yes install nodejs
sudo apt-get --yes install npm
sudo debconf-set-selections <<< 'mysql-server mysql-server/root_password password $MYSQL_ROOT_PW'
sudo debconf-set-selections <<< 'mysql-server mysql-server/root_password_again password $MYSQL_ROOT_PW'
sudo apt-get --yes install mysql-server
