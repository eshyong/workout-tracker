#!/bin/bash

source ./prod_env_vars
# Turn on the following flags
# -e: terminate script on error
# -u: terminate script on unbound variable
# -x: log each line of the script as it is executed
# -o pipefail: sets the exit status of a pipe to the last
#   command that returned a non-zero status
set -eux -o pipefail

# Run schema creation/migrations on DB
set +x
echo 'Creating workouts DB'
mysql -u root -h "$GCLOUD_MYSQL_INSTANCE_IP" --password="$MYSQL_ROOT_PW" < sql/create_db.sql

# Create workout_tracker user
command=$(cat <<EOF
# Safe way of dropping a user if it doesn't exist
GRANT USAGE ON *.* TO 'workout_tracker'@'%';
DROP USER 'workout_tracker'@'%';
# Create new user
CREATE USER 'workout_tracker'@'%' IDENTIFIED BY '$MYSQL_WORKOUT_TRACKER_PW';
# Grant all privileges to the workouts database to the workout tracker app
GRANT ALL ON workouts.* to 'workout_tracker'@'%';
EOF
)
echo 'Creating workout_tracker user'
mysql -u root -h "$GCLOUD_MYSQL_INSTANCE_IP" --password="$MYSQL_ROOT_PW" --execute "$command"
