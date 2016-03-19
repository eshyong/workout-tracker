#!/bin/bash

# Turn on the following flags
# -e: terminate script on error
# -u: terminate script on unbound variable
# -x: log each line of the script as it is executed
# -o pipefail: sets the exit status of a pipe to the last
# 	command that returned a non-zero status
set -eux -o pipefail

# Start MySQL server and Node server
mysql.server start
nodemon
