import Axios from 'axios';
import crypto from 'crypto';
import fs from 'fs-extra';
import * as glob from 'glob';
import path from 'upath';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * MD5 file synchronously
 * @param path
 */
export function md5FileSync(path?: string) {
  if (!path || path.length === 0) return undefined;
  let fileBuffer = Buffer.from(path);
  if (fs.existsSync(path)) {
    if (fs.statSync(path).isFile()) fileBuffer = fs.readFileSync(path);
  }
  const hashSum = crypto.createHash('md5'); // sha256
  hashSum.update(fileBuffer);
  return hashSum.digest('hex');
}

/**
 * PHP MD5 Equivalent
 * @param data
 */
export function md5(data?: string) {
  if (!data || data.length === 0) return undefined;
  return crypto.createHash('md5').update(data).digest('hex');
}

/**
 * MD5 file asynchronously
 * @param path
 */
export default function md5File(path?: string) {
  if (!path || path.length === 0) return undefined;
  return new Promise((resolve, reject) => {
    const output = crypto.createHash('md5');
    const input = fs.createReadStream(path);

    input.on('error', (err) => {
      reject(err);
    });

    output.once('readable', () => {
      resolve(output.read().toString('hex'));
    });

    input.pipe(output);
  });
}

/**
 * convert file to hash
 * @param alogarithm
 * @param path
 * @param encoding
 * @returns
 */
export function file_to_hash(
  alogarithm: 'sha1' | 'sha256' | 'sha384' | 'sha512' | 'md5',
  path: fs.PathLike,
  encoding: import('crypto').BinaryToTextEncoding = 'hex'
): Promise<string> {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash(alogarithm);
    const rs = fs.createReadStream(path);
    rs.on('error', reject);
    rs.on('data', (chunk) => hash.update(chunk));
    rs.on('end', () => resolve(hash.digest(encoding)));
  });
}

/**
 * convert data to hash (async)
 * @param alogarithm
 * @param data
 * @param encoding
 * @returns
 */
export function data_to_hash(
  alogarithm: 'sha1' | 'sha256' | 'sha384' | 'sha512' | 'md5' = 'sha1',
  data: crypto.BinaryLike,
  encoding: import('crypto').BinaryToTextEncoding = 'hex'
): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      resolve(data_to_hash_sync(alogarithm, data, encoding));
    } catch (e) {
      reject(e);
    }
  });
}

/**
 * convert data to hash (sync)
 * @param alogarithm
 * @param data
 * @param encoding
 * @returns
 */
export function data_to_hash_sync(
  alogarithm: 'sha1' | 'sha256' | 'sha384' | 'sha512' | 'md5' = 'sha1',
  data: crypto.BinaryLike,
  encoding: import('crypto').BinaryToTextEncoding = 'hex'
) {
  return crypto.createHash(alogarithm).update(data).digest(encoding);
}

/**
 * get hashes from folder
 * @param alogarithm
 * @param folder
 * @param options
 * @returns
 */
export async function folder_to_hash(
  alogarithm: 'sha1' | 'sha256' | 'sha384' | 'sha512' | 'md5',
  folder: string,
  options: {
    /**
     * override pattern to search files
     */
    pattern: string;
    /**
     * ignore files by patterns from search
     */
    ignored: string[];
    /**
     * encoding type
     */
    encoding: crypto.BinaryToTextEncoding;
  }
): Promise<{ filesWithHash: Record<string, string>; hash: string }> {
  return new Promise((resolvePromise, rejectPromise) => {
    options = Object.assign(
      {
        encoding: 'hex' as crypto.BinaryToTextEncoding,
        ignored: [] as string[],
        pattern: ''
      },
      options || {}
    );
    if (folder.startsWith('file:')) folder = folder.replace('file:', '');
    // fix non exist
    if (!fs.existsSync(folder)) folder = path.join(__dirname, folder);
    // run only if exist
    if (fs.existsSync(folder)) {
      glob
        .glob(options.pattern || '**/*', {
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
        })
        .then((matches) => {
          const filesWithHash = {} as Record<string, any>;
          for (let i = 0; i < matches.length; i++) {
            const item = matches[i];
            const fullPath = path.join(folder, item);
            const statInfo = fs.statSync(fullPath);
            if (statInfo.isFile()) {
              const fileInfo = `${fullPath}:${statInfo.size}:${statInfo.mtimeMs}`;
              const hash = data_to_hash_sync(alogarithm, fileInfo, options.encoding);
              filesWithHash[fullPath] = hash;
            }
          }
          resolvePromise({
            filesWithHash,
            hash: data_to_hash_sync(alogarithm, Object.values(filesWithHash).join(''), options.encoding)
          });
        })
        .catch(rejectPromise);
    } else {
      console.log(folder + ' not found');
    }
  });
}

/**
 * convert data to hash
 * @param alogarithm
 * @param url
 * @param encoding
 * @returns
 */
export async function url_to_hash(
  alogarithm: 'sha1' | 'sha256' | 'sha384' | 'sha512' | 'md5' = 'sha1',
  url: string,
  encoding: crypto.BinaryToTextEncoding = 'hex'
) {
  return new Promise((resolve, reject) => {
    let outputLocationPath = path.join(__dirname, 'node_modules/.cache/postinstall', path.basename(url));
    // remove slashes when url ends with slash
    if (!path.basename(url).endsWith('/')) {
      outputLocationPath = outputLocationPath.replace(/\/$/, '');
    }
    // add extension when dot not exist
    if (!path.basename(url).includes('.')) {
      outputLocationPath += '.tgz';
    }
    if (!fs.existsSync(path.dirname(outputLocationPath))) {
      fs.mkdirSync(path.dirname(outputLocationPath), { recursive: true });
    }
    const writer = fs.createWriteStream(outputLocationPath, { flags: 'w' });
    Axios(url, { responseType: 'stream' }).then((response) => {
      response.data.pipe(writer);
      let error: Error | undefined;
      writer.on('error', (err) => {
        error = err;
        writer.close();
        reject(err);
      });
      writer.on('close', async () => {
        if (!error) {
          // console.log('package downloaded', outputLocationPath.replace(__dirname, ''));
          file_to_hash(alogarithm, outputLocationPath, encoding).then((checksum) => {
            resolve(checksum);
          });
        }
      });
    });
  });
}
