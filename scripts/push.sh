#!/bin/bash -e

## Push with submodules
## usages: sh scripts/push.sh

git submodule foreach "git push | :"
git push