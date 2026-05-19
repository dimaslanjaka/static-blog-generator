import crypto from 'crypto';
import fs from 'fs-extra';
import * as glob from 'glob';
import path from 'upath';

export interface ChecksumOptions {
  ignorePatterns?: string[];

  /**
   * remove whitespaces for text files
   * default: true
   */
  removeWhitespace?: boolean;

  /**
   * normalize CRLF/LF
   * default: true
   */
  normalizeLineEndings?: boolean;

  /**
   * include file path in checksum
   * default: true
   */
  includeFilePath?: boolean;
}

const TEXT_EXTENSIONS = new Set([
  '.js',
  '.cjs',
  '.mjs',
  '.ts',
  '.cts',
  '.mts',
  '.jsx',
  '.tsx',
  '.json',
  '.jsonc',
  '.yaml',
  '.yml',
  '.md',
  '.txt',
  '.py',
  '.php',
  '.java',
  '.kt',
  '.go',
  '.rs',
  '.css',
  '.scss',
  '.sass',
  '.less',
  '.html',
  '.htm',
  '.xml',
  '.svg',
  '.sh',
  '.bash',
  '.zsh',
  '.bat',
  '.cmd',
  '.ps1',
  '.ini',
  '.env',
  '.toml',
  '.lock',
  '.sql'
]);

const ARCHIVE_EXTENSIONS = new Set(['.zip', '.rar', '.7z', '.tar', '.gz', '.tgz', '.bz2', '.xz']);

function normalizePath(file: string): string {
  return path.normalizeSafe(file).replace(/\\/g, '/').toLowerCase();
}

function collectFiles(targetPaths: string[]): string[] {
  const files: string[] = [];

  for (const target of targetPaths) {
    if (fs.existsSync(target)) {
      const stat = fs.statSync(target);

      /**
       * single file
       */
      if (stat.isFile()) {
        files.push(path.resolve(target));
        continue;
      }

      /**
       * directory
       */
      if (stat.isDirectory()) {
        const dirFiles = glob.sync('**/*', {
          cwd: target,
          nodir: true,
          absolute: true,
          dot: true
        });

        files.push(...dirFiles);

        continue;
      }
    }

    /**
     * glob pattern
     */
    const matches = glob.sync(target, {
      nodir: true,
      absolute: true,
      dot: true
    });

    files.push(...matches);
  }

  /**
   * normalize + dedupe + stable sort
   */
  return Array.from(new Set(files.map((file) => normalizePath(path.resolve(file))))).sort((a, b) => a.localeCompare(b));
}

function filterFiles(files: string[], ignorePatterns: string[] = []): string[] {
  return files.filter((file) => {
    return !ignorePatterns.some((pattern) => {
      /**
       * glob ignore
       */
      if (glob.hasMagic(pattern)) {
        return glob
          .sync(pattern, {
            nodir: true,
            absolute: true,
            dot: true
          })
          .map((x) => normalizePath(path.resolve(x)))
          .includes(file);
      }

      /**
       * substring ignore
       */
      return file.includes(normalizePath(pattern));
    });
  });
}

function isTextFile(file: string): boolean {
  return TEXT_EXTENSIONS.has(path.extname(file).toLowerCase());
}

function isArchiveFile(file: string): boolean {
  return ARCHIVE_EXTENSIONS.has(path.extname(file).toLowerCase());
}

function normalizeTextContent(
  content: string,
  options: Required<Pick<ChecksumOptions, 'removeWhitespace' | 'normalizeLineEndings'>>
): string {
  let output = content;

  /**
   * normalize line endings
   */
  if (options.normalizeLineEndings) {
    output = output.replace(/\r\n/g, '\n');
  }

  /**
   * remove all whitespaces
   */
  if (options.removeWhitespace) {
    output = output.replace(/\s+/g, '');
  }

  return output;
}

async function updateHashFromStream(hash: crypto.Hash, file: string): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const stream = fs.createReadStream(file);

    stream.on('data', (chunk) => {
      hash.update(chunk);
    });

    stream.on('end', () => {
      resolve();
    });

    stream.on('error', reject);
  });
}

async function updateFileHash(hash: crypto.Hash, file: string, options: Required<ChecksumOptions>): Promise<void> {
  /**
   * include normalized path
   */
  if (options.includeFilePath) {
    hash.update(file);
  }

  /**
   * text/code files
   */
  if (isTextFile(file)) {
    const text = await fs.readFile(file, 'utf8');

    const normalized = normalizeTextContent(text, {
      removeWhitespace: options.removeWhitespace,
      normalizeLineEndings: options.normalizeLineEndings
    });

    hash.update(normalized);

    return;
  }

  /**
   * archives/binaries
   *
   * raw binary hash
   */
  if (isArchiveFile(file)) {
    await updateHashFromStream(hash, file);
    return;
  }

  /**
   * other binaries
   */
  await updateHashFromStream(hash, file);
}

/**
 * CONTENT checksum
 *
 * text files:
 * - normalize line endings
 * - optionally remove whitespaces
 *
 * binary/archive:
 * - raw bytes checksum
 */
export async function getChecksum(...targetPaths: string[]): Promise<string> {
  return getChecksumWithOptions({}, ...targetPaths);
}

export async function getChecksumWithOptions(options: ChecksumOptions = {}, ...targetPaths: string[]): Promise<string> {
  const resolvedOptions: Required<ChecksumOptions> = {
    ignorePatterns: options.ignorePatterns ?? [],
    removeWhitespace: options.removeWhitespace ?? true,
    normalizeLineEndings: options.normalizeLineEndings ?? true,
    includeFilePath: options.includeFilePath ?? true
  };

  const files = filterFiles(collectFiles(targetPaths), resolvedOptions.ignorePatterns);

  const hash = crypto.createHash('sha256');

  for (const file of files) {
    await updateFileHash(hash, file, resolvedOptions);
  }

  return hash.digest('hex');
}

export default getChecksum;
