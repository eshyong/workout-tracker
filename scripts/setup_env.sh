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

# Install git, nodejs, npm, and redis
apt-get --yes install git \
    nodejs \
    npm \
    redis-server

# Secure redis server by requiring authentication
sed -i.bak "s/# requirepass foobared/requirepass $REDIS_PW/g" /etc/redis/redis.conf
service redis-server restart

# Install node 5.6.0
npm install --global n
n 5.6.0
ln -sf /usr/local/n/versions/node/5.6.0/bin/node /usr/local/bin/node

# Upgrade npm
npm install --global npm

# Install nodemon and webpack globally
npm install --global nodemon webpack
ln -sf /usr/local/n/versions/node/5.6.0/bin/nodemon /usr/local/bin/nodemon
ln -sf /usr/local/n/versions/node/5.6.0/bin/webpack /usr/local/bin/webpack

# Install MySQL 5.6
debconf-set-selections <<< "mysql-server mysql-server/root_password password $MYSQL_ROOT_PW"
debconf-set-selections <<< "mysql-server mysql-server/root_password_again password $MYSQL_ROOT_PW"
apt-get --yes install mysql-server-5.6

# Install flyway
pushd /tmp
curl -O https://repo1.maven.org/maven2/org/flywaydb/flyway-commandline/4.0/flyway-commandline-4.0-linux-x64.tar.gz
tar xzvf flyway-commandline-4.0-linux-x64.tar.gz
mv -f flyway-4.0 /opt
ln -sf /opt/flyway-4.0/flyway /usr/local/bin/flyway
