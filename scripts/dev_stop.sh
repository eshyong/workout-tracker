#!/bin/bash

# Turn on the following flags:
# -e: terminate script on error
# -u: terminate script on unbound variable
# -x: log each line of the script as it is executed
# -o pipefail: sets the exit status of a pipe to the last
# 	command that returned a non-zero status
set -eux -o pipefail

# Kill any node processes, including nodemon
# Then shut off MySQL
if pgrep node; then
    pkill node
fi
if service mysql status | grep -q "start"; then
    service mysql stop
fi
