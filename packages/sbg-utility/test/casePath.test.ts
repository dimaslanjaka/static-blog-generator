import { describe, expect, it } from '@jest/globals';
import { join } from 'path';
import { isWindows, trueCasePathSync } from '../src/utils/filemanager/case-path';

describe('true-case-path local', () => {
  describe('should be Uppercase Drive letter on windows', () => {
    it('windows style path separator', () => {
      const currentFile = trueCasePathSync(__filename);
      const nonExist = trueCasePathSync(join(__dirname, 'nonExist.file'));
      if (isWindows) {
        expect(/^[A-Z]:\\/gm.test(currentFile)).toBeTruthy();
        expect(/^[A-Z]:\\/gm.test(nonExist)).toBeTruthy();
      }
    });
    it('UNIX style path separator', () => {
      const currentFile = trueCasePathSync(__filename, { unix: true });
      const nonExist = trueCasePathSync(join(__dirname, 'nonExist.file'), { unix: true });
      if (isWindows) {
        expect(/^[A-Z]:\//gm.test(currentFile)).toBeTruthy();
        expect(/^[A-Z]:\//gm.test(nonExist)).toBeTruthy();
      }
    });
  });
});
