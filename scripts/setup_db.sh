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

# Create workout_tracker user
set +x
command=$(cat <<EOF
# Safe way of dropping a user if it doesn't exist
GRANT USAGE ON *.* TO 'workout_tracker'@'localhost';
DROP USER 'workout_tracker'@'localhost';
# Create new user
CREATE USER 'workout_tracker'@'localhost' IDENTIFIED BY '$MYSQL_WORKOUT_TRACKER_PW';
EOF
)
echo 'Creating workout_tracker user'
mysql -u root --password="$MYSQL_ROOT_PW" --execute "$command"

# Run SQL scripts on database
echo 'Running sql/create_schema.sql script'
mysql -u root --password="$MYSQL_ROOT_PW" < ./sql/create_schema.sql
