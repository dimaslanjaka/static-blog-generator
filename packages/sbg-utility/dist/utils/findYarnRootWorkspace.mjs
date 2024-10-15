import fs__default from 'fs';
import micromatch from 'micromatch';
import path__default from 'path';

/**
 * search yarn root workspace folder
 * @param ctx option with property `base_dir`
 */
function findYarnRootWorkspace(ctx) {
    const baseDir = ctx.base_dir;
    /**
     * extract workspaces from package.json
     * @param manifest
     * @returns
     */
    const extractWorkspaces = function (manifest) {
        const workspaces = (manifest || {}).workspaces;
        return (workspaces && workspaces.packages) || (Array.isArray(workspaces) ? workspaces : null);
    };
    /**
     * read package.json from given folder
     * @param dir
     * @returns
     */
    const readPackageJSON = function (dir) {
        const file = path__default.join(dir, 'package.json');
        if (fs__default.existsSync(file)) {
            return JSON.parse(fs__default.readFileSync(file).toString());
        }
    };
    let previous = 'THIS INITIATOR VALUE WILL NEVER EXECUTED';
    let current = path__default.normalize(baseDir);
    // loop searching
    do {
        const manifest = readPackageJSON(current);
        if (!manifest)
            continue;
        const workspaces = extractWorkspaces(manifest);
        if (workspaces) {
            const relativePath = path__default.relative(current, baseDir);
            if (relativePath === '' || micromatch([relativePath], workspaces).length > 0) {
                return current;
            }
            return null;
        }
        previous = current;
        current = path__default.dirname(current);
    } while (current !== previous);
    return null;
}

export { findYarnRootWorkspace as default, findYarnRootWorkspace };
