import Axios from 'axios';
import CryptoJS from 'crypto-js';
import fs from 'fs-extra';
import * as glob from 'glob';
import path from 'upath';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type HashAlgorithm = 'sha1' | 'sha256' | 'sha384' | 'sha512' | 'md5';
type HashEncoding = 'hex' | 'base64';

/**
 * Convert data into a cryptographic hash synchronously.
 *
 * Supports both string and {@link Buffer} input values and returns the hash
 * encoded as either hexadecimal (`hex`) or Base64 (`base64`).
 *
 * @param algorithm - Hash algorithm to use.
 * @param data - Input data to hash.
 * @param encoding - Output encoding format.
 * @returns Encoded hash string.
 *
 * @example
 * ```ts
 * dataToHashSync('sha256', 'hello world', 'hex');
 * // => "b94d27b9934d3e08a52e52d7da7dab..."
 * ```
 *
 * @example
 * ```ts
 * const buffer = Buffer.from('hello');
 * dataToHashSync('md5', buffer, 'base64');
 * // => "XUFAKrxLKna5cZ2REBfFkg=="
 * ```
 *
 * @throws {Error}
 * Thrown when the provided algorithm is not supported.
 */
function dataToHashSync(algorithm: HashAlgorithm, data: string | Buffer, encoding: HashEncoding): string {
  let hash: CryptoJS.lib.WordArray;

  const wordArray = typeof data === 'string' ? CryptoJS.enc.Utf8.parse(data) : CryptoJS.lib.WordArray.create(data);

  switch (algorithm) {
    case 'md5':
      hash = CryptoJS.MD5(wordArray);
      break;

    case 'sha1':
      hash = CryptoJS.SHA1(wordArray);
      break;

    case 'sha256':
      hash = CryptoJS.SHA256(wordArray);
      break;

    case 'sha384':
      hash = CryptoJS.SHA384(wordArray);
      break;

    case 'sha512':
      hash = CryptoJS.SHA512(wordArray);
      break;

    default:
      throw new Error(`Unsupported algorithm: ${algorithm}`);
  }

  return hash.toString(encoding === 'base64' ? CryptoJS.enc.Base64 : CryptoJS.enc.Hex);
}

/**
 * MD5 file synchronously
 * @param filePath
 */
export function md5FileSync(filePath?: string): string | undefined {
  if (!filePath || filePath.length === 0) return undefined;
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const fileBuffer = fs.readFileSync(filePath);
    return CryptoJS.MD5(CryptoJS.lib.WordArray.create(fileBuffer)).toString(CryptoJS.enc.Hex);
  }
  return undefined;
}

/**
 * MD5 file asynchronously
 * @param filePath
 */
export async function md5File(filePath?: string): Promise<string | undefined> {
  if (!filePath || filePath.length === 0) return undefined;
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const fileBuffer = await fs.readFile(filePath);
    return CryptoJS.MD5(CryptoJS.lib.WordArray.create(fileBuffer)).toString(CryptoJS.enc.Hex);
  }
  return undefined;
}

/**
 * convert file to hash
 * @param algorithm
 * @param filePath
 * @param encoding
 */
export async function file_to_hash(
  algorithm: HashAlgorithm,
  filePath: fs.PathLike,
  encoding: HashEncoding = 'hex'
): Promise<string> {
  if (!fs.existsSync(filePath)) throw new Error('File not found');
  const fileBuffer = await fs.readFile(filePath);
  return dataToHashSync(algorithm, fileBuffer, encoding);
}

/**
 * Generate deterministic hashes for files inside a folder and a combined folder hash.
 *
 * The function scans a directory using `glob`, hashes file metadata
 * (`fullPath:size:mtimeMs`) for each matched file, and then generates
 * a final hash from all collected file hashes.
 *
 * This does **not** hash the actual file contents. It hashes file metadata
 * only, making it significantly faster for large directories.
 *
 * @param algorithm - Hash algorithm used for file and folder hashes.
 * @param folder - Folder path to scan. Relative paths are resolved from `__dirname`.
 * Supports `file:` prefixed paths.
 * @param options - Folder hashing options.
 * @param options.pattern - Glob pattern used to match files. Defaults to `**\/*`.
 * @param options.ignored - Additional glob patterns to ignore.
 * Default ignore rules include common build/cache directories and `node_modules`.
 * @param options.encoding - Output hash encoding format. Defaults to `hex`.
 *
 * @returns Object containing:
 * - `filesWithHash`: Mapping of file paths to metadata hashes.
 * - `hash`: Combined hash generated from all file hashes.
 *
 * @example
 * ```ts
 * const result = await folder_to_hash('sha256', './dist');
 *
 * console.log(result.hash);
 * console.log(result.filesWithHash);
 * ```
 *
 * @example
 * ```ts
 * await folder_to_hash('md5', './src', {
 *   pattern: '**\/*.ts',
 *   ignored: ['**\/*.test.ts'],
 *   encoding: 'base64'
 * });
 * ```
 *
 * @throws {Error}
 * Thrown when filesystem access or glob scanning fails.
 */
export async function folder_to_hash(
  algorithm: HashAlgorithm,
  folder: string,
  options?: {
    pattern?: string;
    ignored?: string[];
    encoding?: HashEncoding;
  }
): Promise<{ filesWithHash: Record<string, string>; hash: string }> {
  options = Object.assign(
    {
      encoding: 'hex' as HashEncoding,
      ignored: [] as string[],
      pattern: ''
    },
    options || {}
  );

  if (folder.startsWith('file:')) folder = folder.replace('file:', '');
  if (!fs.existsSync(folder)) folder = path.join(__dirname, folder);

  if (fs.existsSync(folder)) {
    const matches = await glob.glob(options.pattern || '**/*', {
      cwd: folder,
      ignore: (
        options.ignored || [
          '**/tmp/**',
          '**/build/**',
          '**/.cache/**',
          '**/dist/**',
          '**/.vscode/**',
          '**/coverage/**',
          '**/release/**',
          '**/bin/**',
          '**/*.json'
        ]
      ).concat('**/.git*/**', '**/node_modules/**'),
      dot: true,
      noext: true
    });

    const filesWithHash: Record<string, string> = {};
    for (const item of matches) {
      const fullPath = path.join(folder, item);
      const statInfo = fs.statSync(fullPath);
      if (statInfo.isFile()) {
        const fileInfo = `${fullPath}:${statInfo.size}:${statInfo.mtimeMs}`;
        filesWithHash[fullPath] = dataToHashSync(algorithm, fileInfo, options.encoding || 'hex');
      }
    }

    return {
      filesWithHash,
      hash: dataToHashSync(algorithm, Object.values(filesWithHash).join(''), options.encoding || 'hex')
    };
  }

  console.log(folder + ' not found');
  return { filesWithHash: {}, hash: '' };
}

/**
 * convert URL content to hash
 * @param algorithm
 * @param url
 * @param encoding
 */
export async function url_to_hash(
  algorithm: HashAlgorithm = 'sha1',
  url: string,
  encoding: HashEncoding = 'hex'
): Promise<string> {
  let outputLocationPath = path.join(__dirname, 'node_modules/.cache/postinstall', path.basename(url));
  if (!path.basename(url).endsWith('/')) {
    outputLocationPath = outputLocationPath.replace(/\/$/, '');
  }
  if (!path.basename(url).includes('.')) {
    outputLocationPath += './tgz';
  }

  if (!fs.existsSync(path.dirname(outputLocationPath))) {
    fs.mkdirSync(path.dirname(outputLocationPath), { recursive: true });
  }

  const writer = fs.createWriteStream(outputLocationPath, { flags: 'w' });
  const response = await Axios(url, { responseType: 'stream' });

  await new Promise<void>((resolve, reject) => {
    response.data.pipe(writer);
    writer.on('error', (err) => {
      writer.close();
      reject(err);
    });
    writer.on('close', () => {
      resolve();
    });
  });

  return file_to_hash(algorithm, outputLocationPath, encoding);
}
