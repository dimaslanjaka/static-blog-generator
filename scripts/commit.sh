#!/bin/bash -e

## Commit With Submodules
## usages: sh scripts/commit.sh "commit message"

if [ -z "$1" ]; then
    echo "You need to provide a commit message"
    exit
fi

git submodule foreach "
    git add -A .
    git update-index --refresh
    commits=\$(git diff-index HEAD)
    if [ ! -z \"\$commits\" ]; then
        git commit -am \"$*\"
    fi"

git add -A .
git commit -am "$*"
