import fs from 'fs-extra';
import path from 'upath';

/**
 * Checks if the current NODE_ENV indicates a development environment.
 * Returns true if NODE_ENV contains 'dev', false otherwise.
 */
export function isdev(): boolean {
  return /dev/i.test(process.env.NODE_ENV || '');
}

/**
 * Determines if the provided object is a class constructor.
 * @param obj The object to check.
 * Returns true if obj is a class constructor, false otherwise.
 */
export function isClass(obj: unknown): boolean {
  return (
    typeof obj === 'function' &&
    (/^class\s/.test(Function.prototype.toString.call(obj)) || Object.getOwnPropertyNames(obj.prototype).length > 1)
  );
}

/**
 * Gets the path to a binary command in the local node_modules/.bin directory.
 * @param commandName The name of the command.
 * Returns the path to the command binary.
 */
export function get_binary_path(commandName: string, resolveNodeAbsolutePath = false): string {
  if (commandName === 'node') {
    if (resolveNodeAbsolutePath) return process.execPath; // Use the current Node.js executable path
    return 'node'; // Return 'node' for relative paths
  }

  // Search for command in Composer's vendor/bin
  const composerBinDirs = [path.join(process.cwd(), 'vendor', 'bin')];
  for (const binDir of composerBinDirs) {
    const composerCmd = path.join(binDir, commandName);
    if (fs.existsSync(composerCmd)) {
      return composerCmd;
    }
  }

  // Search for command in Python venv bin/Scripts
  const venvDirs = [path.join(process.cwd(), 'venv'), path.join(process.cwd(), '.venv')];
  for (const venv of venvDirs) {
    const binName = process.platform === 'win32' ? `Scripts/${commandName}.exe` : `bin/${commandName}`;
    const venvCmd = path.join(venv, binName);
    if (fs.existsSync(venvCmd)) {
      return venvCmd;
    }
  }

  // Default: node_modules/.bin
  const cmdPath = [
    process.cwd(),
    ((process as any).mainModule || (process as any).main).paths[0].split('node_modules')[0].slice(0, -1)
  ]
    .map((cwd) => {
      const nm = path.join(cwd, 'node_modules/.bin');
      return path.join(nm, commandName);
    })
    .filter(fs.existsSync)[0];

  if (!cmdPath) {
    console.error(`Command '${commandName}' not found in node_modules/.bin`);
    return commandName;
  }

  return process.platform === 'win32' ? `${cmdPath}.cmd` : cmdPath;
}

export { get_binary_path as getBinaryPath };
