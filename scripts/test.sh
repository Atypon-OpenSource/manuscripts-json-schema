#!/bin/bash

set -e
set -o pipefail

tape tests/*.js | tap-dot
