import fs from 'fs';
import micromatch from 'micromatch';
import path from 'path';

/**
 * search yarn root workspace folder
 * @param ctx option with property `base_dir`
 */
function findYarnRootWorkspace(ctx: { base_dir: string }): string | null {
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

// export = findYarnRootWorkspace;
export { findYarnRootWorkspace };
export default findYarnRootWorkspace;
