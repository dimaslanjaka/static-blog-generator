import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Resolves the executable path for a locally installed Node.js binary
 * from `node_modules/.bin`.
 *
 * Resolution order:
 * 1. Current module directory
 * 2. Current working directory (`process.cwd()`)
 * 3. Main module root directory
 *
 * If the executable cannot be found, the original command name is returned
 * so it can still be resolved from the system `PATH`.
 *
 * @param commandName - Binary name to resolve.
 * @returns Absolute executable path if found, otherwise the original command name.
 */
function getNodeExecutable(commandName: string): string {
  // Support both CommonJS and ESM
  const currentDir = typeof __dirname === 'undefined' ? path.dirname(fileURLToPath(import.meta.url)) : __dirname;

  const mainPaths = (process.mainModule ?? (process as any).main)?.paths ?? [];

  const rootPath = mainPaths[0]?.split('node_modules')[0]?.replace(/[\\/]+$/, '');

  const searchPaths = [currentDir, process.cwd(), rootPath].filter((value): value is string => Boolean(value));

  const executablePath = searchPaths
    .map((cwd) => path.join(cwd, 'node_modules', './bin', commandName))
    .find((candidate) => {
      const fullPath = process.platform === 'win32' ? `${candidate}.cmd` : candidate;

      return fs.existsSync(fullPath);
    });

  if (!executablePath) {
    console.error(`Command '${commandName}' not found in node_modules/.bin`);

    return commandName;
  }

  return process.platform === 'win32' ? `${executablePath}.cmd` : executablePath;
}

export default getNodeExecutable;
