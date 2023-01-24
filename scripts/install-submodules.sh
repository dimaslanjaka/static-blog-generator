#!/bin/bash -e

# auto clone all submodules, prevent not-matched hash
# usages: sh scripts/install-submodules.sh

ROOT="$(git rev-parse --show-toplevel)"

git -C "${REPO_PATH}" config -f .gitmodules --get-regexp '^submodule\..*\.path$' |
    while read -r KEY MODULE_PATH
    do
        # cd git root dir
        cd ${ROOT}
        # If the module's path exists, remove it.
        # This is done b/c the module's path is currently
        # not a valid git repo and adding the submodule will cause an error.
        if [ -d "${MODULE_PATH}" ]; then
            echo "deleting ${MODULE_PATH}"
            rm -rf "${MODULE_PATH}"
        fi

        NAME="$(echo "${KEY}" | sed 's/^submodule\.\(.*\)\.path$/\1/')"

        url_key="$(echo "${KEY}" | sed 's/\.path$/.url/')"
        branch_key="$(echo "${KEY}" | sed 's/\.path$/.branch/')"

        URL="$(git config -f .gitmodules --get "${url_key}")"
        BRANCH="$(git config -f .gitmodules --get "${branch_key}" || echo "master")"

        git -C "${REPO_PATH}" submodule add --force -b "${BRANCH}" --name "${NAME}" "${URL}" "${MODULE_PATH}" || echo "cannot add submodule ${MODULE_PATH}"

        repo=${URL#"https://github.com/"}
        URL_WITH_TOKEN="https://${ACCESS_TOKEN}@github.com/${repo}"

        echo "apply token for ${repo} at ${MODULE_PATH} branch ${BRANCH}"
        cd "${MODULE_PATH}"
        git remote set-url origin "${URL_WITH_TOKEN}"
        git fetch --all
        git pull origin "${BRANCH}" -X theirs
    done

git -C "${REPO_PATH}" submodule update --init --recursive