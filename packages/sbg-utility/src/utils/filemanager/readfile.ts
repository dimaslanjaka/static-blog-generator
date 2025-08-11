import fs from 'fs-extra';
import Logger from '../logger';

/**
 * Reads a file and returns its content as a string. If the file does not exist, returns null.
 * Supports synchronous and asynchronous modes based on the `useAsync` parameter.
 *
 * @param filePath - The path to the file to read.
 * @param useAsync - Whether to use asynchronous mode. Defaults to `false`.
 * @returns The file content as a string or null if the file does not exist.
 */
function readfile(filePath: string): string | null;
function readfile(filePath: string, useAsync: false): string | null;
function readfile(filePath: string, useAsync: true): Promise<string | null>;
function readfile(filePath: string, useAsync: boolean = false): string | null | Promise<string | null> {
  if (useAsync) {
    return (async () => {
      try {
        const fileExists = await fs.pathExists(filePath);
        if (!fileExists) {
          return null;
        }
        return await fs.readFile(filePath, 'utf-8');
      } catch (error) {
        Logger.error(`Error reading file at ${filePath}:`, error);
        return null;
      }
    })();
  } else {
    try {
      if (!fs.pathExistsSync(filePath)) {
        return null;
      }
      return fs.readFileSync(filePath, 'utf-8');
    } catch (error) {
      Logger.error(`Error reading file at ${filePath}:`, error);
      return null;
    }
  }
}

export { readfile };
export default readfile;
