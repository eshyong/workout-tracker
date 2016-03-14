#!/bin/bash

set -eux -o pipefail

# OSX
if [[ "$(uname)" = "Darwin" ]]; then
	mysql.server start
fi

nodemon
