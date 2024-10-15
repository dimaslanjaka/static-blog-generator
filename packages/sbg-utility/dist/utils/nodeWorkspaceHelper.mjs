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
/**
 * Resolve the path of a command binary from node_modules/.bin.
 *
 * @param commandName - The name of the command to resolve.
 * @returns The resolved command path or the original command name if not found.
 */
function resolveCommand(commandName) {
    const dirs = [__dirname, process.cwd()];
    if (typeof process === 'object') {
        if ('mainModule' in process)
            dirs.push(process.mainModule?.paths[0].split('node_modules')[0].slice(0, -1));
        if ('main' in process)
            dirs.push(process.main?.paths[0].split('node_modules')[0].slice(0, -1));
    }
    try {
        dirs.push(findYarnRootWorkspace({ base_dir: process.cwd() }));
    }
    catch (_) {
        //
    }
    const cmdPath = dirs
        .filter((str) => typeof str === 'string' && str.length > 0)
        .map((cwd) => {
        const nm = path__default.join(cwd, 'node_modules/.bin');
        return path__default.join(nm, commandName);
    })
        .filter(fs__default.existsSync)[0];
    if (!cmdPath) {
        console.error(`Command '${commandName}' not found in node_modules/.bin`);
        return commandName; // Return the original command name
    }
    return process.platform === 'win32' ? `${cmdPath}.cmd` : cmdPath;
}
const cmd = resolveCommand;

export { cmd, findYarnRootWorkspace as default, findYarnRootWorkspace, resolveCommand };
