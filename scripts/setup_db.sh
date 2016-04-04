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

# Run schema creation/migrations on DB
set +x
echo 'Creating workouts DB'
mysql -u root --password="$MYSQL_ROOT_PW" < sql/create_db.sql

# Create workout_tracker user
command=$(cat <<EOF
# Safe way of dropping a user if it doesn't exist
GRANT USAGE ON *.* TO 'workout_tracker'@'localhost';
DROP USER 'workout_tracker'@'localhost';
# Create new user
CREATE USER 'workout_tracker'@'localhost' IDENTIFIED BY '$MYSQL_WORKOUT_TRACKER_PW';
# Grant all privileges to the workouts database to the workout tracker app
GRANT ALL ON workouts.* to 'workout_tracker'@'localhost';
EOF
)
echo 'Creating workout_tracker user'
mysql -u root --password="$MYSQL_ROOT_PW" --execute "$command"

echo 'Running DB migrations'
flyway \
    -user=workout_tracker \
    -password="$MYSQL_WORKOUT_TRACKER_PW" \
    -configFile=$(pwd)/flyway.dev.conf \
    migrate
