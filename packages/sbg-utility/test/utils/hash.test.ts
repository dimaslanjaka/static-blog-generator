import fs from 'fs-extra';
import path from 'upath';
import { fileURLToPath } from 'url';
import * as hashDist from '../../dist/utils/hash';
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
}

runHashTests(hashSrc, 'hash utils (src)');
runHashTests(hashDist, 'hash utils (dist)');
