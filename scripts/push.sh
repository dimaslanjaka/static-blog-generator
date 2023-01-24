#!/bin/bash -e

## Push with submodules
## usages: sh scripts/push.sh

ROOT="$(git rev-parse --show-toplevel)"
git -C "${REPO_PATH}" config -f .gitmodules --get-regexp '^submodule\..*\.path$' |
    while read -r KEY MODULE_PATH
    do
        # cd git root dir
        cd ${ROOT}


        cd "${MODULE_PATH}"
        if [ -z $(git status --porcelain) ];
        then
            echo "${repo} at ${MODULE_PATH} no changes"
        else
            echo "push for ${repo} at ${MODULE_PATH} branch ${BRANCH}"
            git push origin "${BRANCH}"
        fi
    done