import { describe, expect, test } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import semver from 'semver';
import { LocalStorage } from '../../../src/utils/LocalStorage.js';

describe('LocalStorage', () => {
  test('recursive mkdir', () => {
    const nonExistentDirectory = path.resolve('./tmp/does_not_exist');

    expect(fs.existsSync(nonExistentDirectory)).toBe(false);

    const nonExistentSubdirectory = path.resolve(path.join(nonExistentDirectory, 'desired_location'));

    expect(fs.existsSync(nonExistentSubdirectory)).toBe(false);

    if (semver.gte(process.version, '10.12.0')) {
      const ls1 = new LocalStorage(nonExistentSubdirectory);

      expect(fs.existsSync(nonExistentDirectory)).toBe(true);
      expect(fs.existsSync(nonExistentSubdirectory)).toBe(true);

      ls1._deleteLocation();

      expect(fs.existsSync(nonExistentSubdirectory)).toBe(false);

      fs.rmdirSync(nonExistentDirectory);

      expect(fs.existsSync(nonExistentDirectory)).toBe(false);
    } else {
      expect(() => {
        new LocalStorage();
      }).toThrow(`node version ${process.version} expected to fail on recursive directory creation`);
    }
  });
});
