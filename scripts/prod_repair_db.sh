#!/bin/bash

# Turn on the following flags
# -e: terminate script on error
# -u: terminate script on unbound variable
# -x: log each line of the script as it is executed
# -o pipefail: sets the exit status of a pipe to the last
#   command that returned a non-zero status
set -eux -o pipefail

set +x
echo 'Running DB migrations'
flyway \
    -configFile=$(pwd)/flyway.prod.conf \
    repair
