import Axios from 'axios';
import CryptoJS from 'crypto-js';
import fs from 'fs-extra';
import * as glob from 'glob';
import path from 'upath';
import { fileURLToPath } from 'url';
import getChecksum from './hash/getChecksum';
export { getChecksum };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * MD5 file synchronously
 * @param path
 */
export function md5FileSync(path?: string): string | undefined {
  if (!path || path.length === 0) return undefined;
  if (fs.existsSync(path) && fs.statSync(path).isFile()) {
    const fileBuffer = fs.readFileSync(path);
    return CryptoJS.MD5(CryptoJS.lib.WordArray.create(fileBuffer)).toString(CryptoJS.enc.Hex);
  }
  return undefined;
}

/**
 * PHP MD5 Equivalent
 * @param data
 */
export function md5(data?: string): string | undefined {
  if (!data || data.length === 0) return undefined;
  return CryptoJS.MD5(data).toString(CryptoJS.enc.Hex);
}

/**
 * MD5 file asynchronously
 * @param path
 */
export async function md5File(path?: string): Promise<string | undefined> {
  if (!path || path.length === 0) return undefined;
  if (fs.existsSync(path) && fs.statSync(path).isFile()) {
    const fileBuffer = await fs.readFile(path);
    return CryptoJS.MD5(CryptoJS.lib.WordArray.create(fileBuffer)).toString(CryptoJS.enc.Hex);
  }
  return undefined;
}

/**
 * convert file to hash
 * @param algorithm
 * @param path
 * @param encoding
 * @returns
 */
export async function file_to_hash(
  algorithm: 'sha1' | 'sha256' | 'sha384' | 'sha512' | 'md5',
  path: fs.PathLike,
  encoding: 'hex' | 'base64' = 'hex'
): Promise<string> {
  if (!fs.existsSync(path)) throw new Error('File not found');
  const fileBuffer = await fs.readFile(path);
  let hash: CryptoJS.lib.WordArray;
  switch (algorithm) {
    case 'md5':
      hash = CryptoJS.MD5(CryptoJS.lib.WordArray.create(fileBuffer));
      break;
    case 'sha1':
      hash = CryptoJS.SHA1(CryptoJS.lib.WordArray.create(fileBuffer));
      break;
    case 'sha256':
      hash = CryptoJS.SHA256(CryptoJS.lib.WordArray.create(fileBuffer));
      break;
    case 'sha384':
      hash = CryptoJS.SHA384(CryptoJS.lib.WordArray.create(fileBuffer));
      break;
    case 'sha512':
      hash = CryptoJS.SHA512(CryptoJS.lib.WordArray.create(fileBuffer));
      break;
    default:
      throw new Error('Unsupported algorithm');
  }
  return hash.toString(encoding === 'base64' ? CryptoJS.enc.Base64 : CryptoJS.enc.Hex);
}

/**
 * convert data to hash (async)
 * @param algorithm
 * @param data
 * @param encoding
 * @returns
 */
export async function data_to_hash(
  algorithm: 'sha1' | 'sha256' | 'sha384' | 'sha512' | 'md5' = 'sha1',
  data: string | Buffer,
  encoding: 'hex' | 'base64' = 'hex'
): Promise<string> {
  return data_to_hash_sync(algorithm, data, encoding);
}

/**
 * convert data to hash (sync)
 * @param algorithm
 * @param data
 * @param encoding
 * @returns
 */
export function data_to_hash_sync(
  algorithm: 'sha1' | 'sha256' | 'sha384' | 'sha512' | 'md5' = 'sha1',
  data: string | Buffer,
  encoding: 'hex' | 'base64' = 'hex'
): string {
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
      throw new Error('Unsupported algorithm');
  }
  return hash.toString(encoding === 'base64' ? CryptoJS.enc.Base64 : CryptoJS.enc.Hex);
}

/**
 * get hashes from folder
 * @param algorithm
 * @param folder
 * @param options
 * @returns
 */
export async function folder_to_hash(
  algorithm: 'sha1' | 'sha256' | 'sha384' | 'sha512' | 'md5',
  folder: string,
  options: {
    pattern: string;
    ignored: string[];
    encoding: 'hex' | 'base64';
  }
): Promise<{ filesWithHash: Record<string, string>; hash: string }> {
  options = Object.assign(
    {
      encoding: 'hex' as 'hex' | 'base64',
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
        filesWithHash[fullPath] = data_to_hash_sync(algorithm, fileInfo, options.encoding);
      }
    }
    return {
      filesWithHash,
      hash: data_to_hash_sync(algorithm, Object.values(filesWithHash).join(''), options.encoding)
    };
  } else {
    console.log(folder + ' not found');
    return { filesWithHash: {}, hash: '' };
  }
}

/**
 * convert data to hash
 * @param algorithm
 * @param url
 * @param encoding
 * @returns
 */
export async function url_to_hash(
  algorithm: 'sha1' | 'sha256' | 'sha384' | 'sha512' | 'md5' = 'sha1',
  url: string,
  encoding: 'hex' | 'base64' = 'hex'
): Promise<string> {
  let outputLocationPath = path.join(__dirname, 'node_modules/.cache/postinstall', path.basename(url));
  if (!path.basename(url).endsWith('/')) {
    outputLocationPath = outputLocationPath.replace(/\/$/, '');
  }
  if (!path.basename(url).includes('.')) {
    outputLocationPath += '.tgz';
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
