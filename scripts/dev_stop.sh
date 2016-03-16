#!/bin/bash

set -eux -o pipefail

# Kill node processes
pkill node

# OSX
if [[ "$(uname)" = "Darwin" ]]; then
    mysql.server stop
fi
