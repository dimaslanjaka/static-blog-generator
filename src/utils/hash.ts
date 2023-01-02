import crypto from 'crypto';
import fs from 'fs-extra';

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
) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash(alogarithm);
    const rs = fs.createReadStream(path);
    rs.on('error', reject);
    rs.on('data', (chunk) => hash.update(chunk));
    rs.on('end', () => resolve(hash.digest(encoding)));
  });
}

/**
 * convert data to hash
 * @param alogarithm
 * @param data
 * @param encoding
 * @returns
 */
export function data_to_hash(
  alogarithm: 'sha1' | 'sha256' | 'sha384' | 'sha512' | 'md5' = 'sha1',
  data: crypto.BinaryLike,
  encoding: import('crypto').BinaryToTextEncoding = 'hex'
) {
  return new Promise((resolve, reject) => {
    try {
      const hash = crypto.createHash(alogarithm).update(data).digest(encoding);
      resolve(hash);
    } catch (e) {
      reject(e);
    }
  });
}
