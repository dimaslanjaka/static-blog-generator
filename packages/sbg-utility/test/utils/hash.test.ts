import fs from 'fs-extra';
import path from 'upath';
import { fileURLToPath } from 'url';
import * as hashDist from '../../dist/utils/hash.mjs';
import * as hashSrc from '../../src/utils/hash';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '../../');
const tmpDir = path.join(projectRoot, 'tmp');
const testFile = path.join(tmpDir, 'hash_testfile.txt');
const testData = 'Hello, world!';

function runHashTests(hash: typeof hashSrc | typeof hashDist, label: string) {
  describe(label, () => {
    beforeAll(() => {
      fs.writeFileSync(testFile, testData);
    });

    afterAll(() => {
      fs.removeSync(testFile);
    });

    test('md5FileSync returns correct hash', () => {
      const expected = hash.md5(testData);
      const actual = hash.md5FileSync(testFile);
      expect(actual).toBe(expected);
    });

    test('md5 returns correct hash', () => {
      const hashVal = hash.md5(testData);
      expect(typeof hashVal).toBe('string');
      expect(hashVal).toBeDefined();
      if (hashVal) {
        expect(hashVal.length).toBe(32);
      }
    });

    test('md5File returns correct hash (async)', async () => {
      const expected = hash.md5(testData);
      const actual = await hash.md5File(testFile);
      expect(actual).toBe(expected);
    });

    test('file_to_hash returns correct hash', async () => {
      const hashVal = await hash.file_to_hash('md5', testFile);
      expect(typeof hashVal).toBe('string');
      expect(hashVal.length).toBe(32);
    });

    test('data_to_hash returns correct hash (async)', async () => {
      const hashVal = await hash.data_to_hash('md5', testData);
      expect(typeof hashVal).toBe('string');
      expect(hashVal.length).toBe(32);
    });

    test('data_to_hash_sync returns correct hash', () => {
      const hashVal = hash.data_to_hash_sync('md5', testData);
      expect(typeof hashVal).toBe('string');
      expect(hashVal.length).toBe(32);
    });

    test('folder_to_hash returns hashes for files in folder', async () => {
      const result = await hash.folder_to_hash('md5', tmpDir, {
        pattern: '*.txt',
        ignored: [],
        encoding: 'hex'
      });
      expect(result).toHaveProperty('filesWithHash');
      expect(result).toHaveProperty('hash');
      expect(Object.keys(result.filesWithHash)).toContain(testFile);
    });
  });

  describe('getChecksum', () => {
    const testDir = path.join(tmpDir, 'tmp_checksum_test');
    const fileA = path.join(testDir, 'a.txt');
    const fileB = path.join(testDir, 'b.txt');

    beforeAll(() => {
      fs.ensureDirSync(testDir);
      fs.writeFileSync(fileA, 'hello world');
      fs.writeFileSync(fileB, 'goodbye world');
    });

    afterAll(() => {
      fs.removeSync(testDir);
    });

    it('should return a checksum for a single file', () => {
      const checksum = hash.getChecksum(fileA);
      expect(typeof checksum).toBe('string');
      expect(checksum.length).toBe(64); // SHA-256 hex length
    });

    it('should return a checksum for multiple files', () => {
      const checksum = hash.getChecksum(fileA, fileB);
      expect(typeof checksum).toBe('string');
      expect(checksum.length).toBe(64);
      expect(checksum).not.toBe(hash.getChecksum(fileA));
    });

    it('should return a checksum for a directory', () => {
      const checksum = hash.getChecksum(testDir);
      expect(typeof checksum).toBe('string');
      expect(checksum.length).toBe(64);
    });

    it('should return the same checksum for the same files in any order', () => {
      const checksum1 = hash.getChecksum(fileA, fileB);
      const checksum2 = hash.getChecksum(fileB, fileA);
      expect(checksum1).toBe(checksum2);
    });

    it('should return different checksums if file contents change', () => {
      const original = hash.getChecksum(fileA);
      fs.writeFileSync(fileA, 'changed content');
      const changed = hash.getChecksum(fileA);
      expect(original).not.toBe(changed);
    });
  });
}

runHashTests(hashSrc, 'hash utils (src)');
runHashTests(hashDist, 'hash utils (dist)');
