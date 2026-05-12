import CryptoJS from 'crypto-js';

/**
 * PHP MD5 Equivalent
 * @param data
 * @param short If true, returns a shortened (8-char) version of the MD5 hash. If a number, returns that many characters.
 */
export function md5(data?: string, short: boolean | number = false): string | undefined {
  if (!data || data.length === 0) return undefined;
  const hash = CryptoJS.MD5(data).toString(CryptoJS.enc.Hex);
  if (typeof short === 'number') {
    return hash.substring(0, short);
  } else if (short) {
    return hash.substring(0, 8);
  }
  return hash;
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
  data: cryptolib.BinaryLike,
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
  data: cryptolib.BinaryLike,
  encoding: import('crypto').BinaryToTextEncoding = 'hex'
) {
  return cryptolib.createHash(alogarithm).update(data).digest(encoding);
}
