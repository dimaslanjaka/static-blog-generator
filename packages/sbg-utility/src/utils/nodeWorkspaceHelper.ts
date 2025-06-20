import fs from 'fs';
import micromatch from 'micromatch';
import path from 'path';
import { fileURLToPath } from 'url';
import Logger from './logger';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * search yarn root workspace folder
 * @param ctx option with property `base_dir`
 */
export function findYarnRootWorkspace(ctx: { base_dir: string }): string | null {
  const baseDir = ctx.base_dir;

  /**
   * extract workspaces from package.json
   * @param manifest
   * @returns
   */
  const extractWorkspaces = function (manifest: Record<string, any>) {
    const workspaces = (manifest || {}).workspaces;
    return (workspaces && workspaces.packages) || (Array.isArray(workspaces) ? workspaces : null);
  };

  /**
   * read package.json from given folder
   * @param dir
   * @returns
   */
  const readPackageJSON = function (dir: string): Record<string, any> | undefined {
    const file = path.join(dir, 'package.json');
    if (fs.existsSync(file)) {
      return JSON.parse(fs.readFileSync(file).toString());
    }
  };

  let previous = 'THIS INITIATOR VALUE WILL NEVER EXECUTED';
  let current = path.normalize(baseDir);
  // loop searching
  do {
    const manifest = readPackageJSON(current);
    if (!manifest) continue;
    const workspaces = extractWorkspaces(manifest);

    if (workspaces) {
      const relativePath = path.relative(current, baseDir);
      if (relativePath === '' || micromatch([relativePath], workspaces).length > 0) {
        return current;
      }
      return null;
    }

    previous = current;
    current = path.dirname(current);
  } while (current !== previous);

  return null;
}

/**
 * Resolves the path of a command binary from `node_modules/.bin`.
 *
 * This function searches for the specified command in various directories, including
 * the current working directory, the module directory, and optionally, user-defined
 * search directories. If the command is not found, it returns the original command name.
 *
 * @param commandName - The name of the command to resolve.
 * @param options - Optional parameters for command resolution.
 * @param options.searchDir - A custom directory or an array of directories to search for
 *   the command. If provided, these directories will be included in the search.
 * @returns The resolved command path if found; otherwise, returns the original command name.
 */
export function resolveCommand(commandName: string, options?: { searchDir: string | string[] }) {
  const dirs: any[] = [__dirname, process.cwd()];
  if (typeof process === 'object') {
    if ('mainModule' in process) dirs.push((process as any).mainModule?.paths[0].split('node_modules')[0].slice(0, -1));
    if ('main' in process) dirs.push((process as any).main?.paths[0].split('node_modules')[0].slice(0, -1));
  }
  if (options && options.searchDir) {
    if (!Array.isArray(options.searchDir)) {
      options.searchDir = [options.searchDir];
    }
    dirs.push(...options.searchDir);
  }
  // try {
  //   dirs.push(findYarnRootWorkspace({ base_dir: process.cwd() }));
  // } catch (_) {
  //   //
  // }
  const cmdPath = dirs
    .filter((str) => typeof str === 'string' && str.length > 0)
    .map((cwd) => {
      const nm = path.join(cwd, 'node_modules/.bin');
      return path.join(nm, commandName);
    })
    .filter(fs.existsSync)[0];

  if (!cmdPath) {
    Logger.error(`Command '${commandName}' not found in node_modules/.bin`);
    return commandName; // Return the original command name
  }

  return process.platform === 'win32' ? `${cmdPath}.cmd` : cmdPath;
}

export const cmd = resolveCommand;

export default findYarnRootWorkspace;
