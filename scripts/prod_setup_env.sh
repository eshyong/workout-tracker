#!/bin/bash

# Source environment variables file
source ./prod_env_vars

# Turn on the following flags
# -e: terminate script on error
# -u: terminate script on unbound variable
# -x: log each line of the script as it is executed
# -o pipefail: sets the exit status of a pipe to the last
#   command that returned a non-zero status
set -eux -o pipefail

# Update apt repos
apt-get update

# Install git, redis-server, and mysql-client
apt-get --yes install git redis-server mysql-client

# Secure redis server by requiring authentication
sed -i.bak "s/# requirepass foobared/requirepass $REDIS_PW/g" /etc/redis/redis.conf
service redis-server restart

# Install node 5.6.0
pushd /tmp
curl -O https://nodejs.org/dist/v5.6.0/node-v5.6.0-linux-x64.tar.xz
pushd /opt
tar xvf /tmp/node-v5.6.0-linux-x64.tar.xz
sudo ln -sf /opt/node-v5.6.0-linux-x64/bin/node /usr/local/bin/node
sudo ln -sf /opt/node-v5.6.0-linux-x64/bin/npm /usr/local/bin/npm
popd
popd

# Install nodemon and webpack globally
npm install --global nodemon webpack

# Install flyway
pushd /tmp
curl -O https://repo1.maven.org/maven2/org/flywaydb/flyway-commandline/4.0/flyway-commandline-4.0-linux-x64.tar.gz
pushd /opt
tar xzvf /tmp/flyway-commandline-4.0-linux-x64.tar.gz
ln -sf /opt/flyway-4.0/flyway /usr/local/bin/flyway

# Cleanup
rm -rf /tmp/*
