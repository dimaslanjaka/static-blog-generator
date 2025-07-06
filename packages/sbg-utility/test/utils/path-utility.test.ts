import { describe, expect, it } from '@jest/globals';
import path from 'path';
import url from 'url';
import {
  isWindows,
  normalizePath,
  normalizePathUnix,
  trueCasePathSync
} from '../../src/utils/filemanager/path-utility';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('true-case-path local', () => {
  describe('should be Uppercase Drive letter on windows', () => {
    if (isWindows) {
      it('windows style path separator', () => {
        const currentFile = trueCasePathSync(__filename);
        const nonExist = trueCasePathSync(path.join(__dirname, 'nonExist.file'));
        expect(/^[A-Z]:\\/gm.test(currentFile)).toBeTruthy();
        expect(/^[A-Z]:\\/gm.test(nonExist)).toBeTruthy();
      });
      it('UNIX style path separator', () => {
        const currentFile = trueCasePathSync(__filename, { unix: true });
        const nonExist = trueCasePathSync(path.join(__dirname, 'nonExist.file'), { unix: true });
        expect(/^[A-Z]:\//gm.test(currentFile)).toBeTruthy();
        expect(/^[A-Z]:\//gm.test(nonExist)).toBeTruthy();
      });
    }
    it('normalizePath', () => {
      expect(normalizePath('d:\\x\\s').startsWith('D:')).toBeTruthy();
      expect(normalizePathUnix('d:\\x\\s').startsWith('D:')).toBeTruthy();
      expect(normalizePath('d:\\x\\s').includes('\\')).toBeTruthy();
      expect(normalizePathUnix('d:\\x\\s').includes('/')).toBeTruthy();
    });
  });
});
