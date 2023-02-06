#!/bin/bash -e

## Push with submodules
## usages: sh scripts/push.sh

if [[ -v GITHUB_WORKFLOWS ]];
then
    echo "running in github actions";
    git config --global user.name "dimaslanjaka";
    git config --global user.email "dimaslanjaka@gmail.com";
fi

ROOT="$(git rev-parse --show-toplevel)"
git -C "${REPO_PATH}" config -f .gitmodules --get-regexp '^submodule\..*\.path$' |
    while read -r KEY MODULE_PATH
    do
        # cd git root dir
        cd ${ROOT}

        NAME="$(echo "${KEY}" | sed 's/^submodule\.\(.*\)\.path$/\1/')"

        url_key="$(echo "${KEY}" | sed 's/\.path$/.url/')"
        branch_key="$(echo "${KEY}" | sed 's/\.path$/.branch/')"

        URL="$(git config -f .gitmodules --get "${url_key}")"
        BRANCH="$(git config -f .gitmodules --get "${branch_key}" || echo "master")"

        repo=${URL#"https://github.com/"}

        cd "${MODULE_PATH}"
        if [[ $(git push --dry-run 2>&1) == *"Everything up-to-date"* ]];
        then
            echo "${repo} at ${MODULE_PATH} no changes"
        else
            echo "push for ${repo} at ${MODULE_PATH} branch ${BRANCH}";
            git push origin "${BRANCH}"
        fi
    done

git push