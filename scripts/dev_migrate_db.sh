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

# Make sure MySQL is running
if ! service mysql status | grep -q "start"; then
    service mysql start
fi

set +x
echo 'Running DB migrations'
flyway \
    -user=workout_tracker \
    -password="$MYSQL_WORKOUT_TRACKER_PW" \
    -configFile=$(pwd)/flyway.dev.conf \
    migrate
