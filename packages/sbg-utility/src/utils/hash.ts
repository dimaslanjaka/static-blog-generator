import CryptoJS from 'crypto-js';

/**
 * PHP MD5 Equivalent
 * @param data
 */
export function md5(data?: string): string | undefined {
  if (!data || data.length === 0) return undefined;
  return CryptoJS.MD5(data).toString(CryptoJS.enc.Hex);
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
