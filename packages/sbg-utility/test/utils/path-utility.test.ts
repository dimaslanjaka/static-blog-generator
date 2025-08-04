import { describe, expect, it } from '@jest/globals';
import path from 'path';
import upath from 'upath';
import url from 'url';
import {
  isWindows,
  normalizePath,
  normalizePathUnix,
  trueCasePathSync
} from '../../src/utils/filemanager/path-utility';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const winPath = 'C:\\Users\\Test\\file.txt';
const unixPath = '/home/test/file.txt';

describe('path-utility integration and behavior', () => {
  describe('trueCasePathSync behavior (local paths)', () => {
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

      it('normalizePath and normalizePathUnix formatting', () => {
        expect(normalizePath('d:\\x\\s').startsWith('D:')).toBeTruthy();
        expect(normalizePathUnix('d:\\x\\s').startsWith('D:')).toBeTruthy();
        expect(normalizePath('d:\\x\\s').includes('\\')).toBeTruthy();
        expect(normalizePathUnix('d:\\x\\s').includes('/')).toBeTruthy();
      });
    });
  });

  describe('upath and path-utility integration', () => {
    it('should convert Windows path to Unix style with upath.toUnix', () => {
      const unix = upath.toUnix(winPath);
      expect(unix).toBe('C:/Users/Test/file.txt');
    });

    it('should convert Unix path to Windows style manually', () => {
      const win = unixPath.replace(/\//g, '\\');
      expect(win).toBe('\\home\\test\\file.txt');
    });

    it('normalizePathUnix should return Unix style path', () => {
      const result = normalizePathUnix(winPath);
      expect(result.includes('/')).toBeTruthy();
      expect(result.startsWith('C:')).toBeTruthy();
    });

    it('normalizePath should return Windows style path', () => {
      const result = normalizePath(winPath);
      expect(result.includes('\\')).toBeTruthy();
      expect(result.startsWith('C:')).toBeTruthy();
    });

    it('trueCasePathSync with { unix: true } returns Unix style path', () => {
      const result = trueCasePathSync(winPath, { unix: true });
      expect(result.includes('/')).toBeTruthy();
      expect(result.startsWith('C:')).toBeTruthy();
    });
  });
});
