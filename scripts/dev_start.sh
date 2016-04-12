#!/bin/bash

# Source environment variables file
source ./env_vars

# Turn on the following flags
# -e: terminate script on error
# -u: terminate script on unbound variable
# -x: log each line of the script as it is executed
# -o pipefail: sets the exit status of a pipe to the last
# 	command that returned a non-zero status
set -eux -o pipefail

# Start MySQL server and Node server
if service mysql status | grep -q "stop"; then
    sudo service mysql start
fi
if ! pgrep redis-server; then
    sudo service redis-server start
fi
# Run webpack and nodemon as separate processes
screen -d -m webpack --progress --color --watch
screen -d -m nodemon -L index.js
