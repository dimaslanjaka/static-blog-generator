import { describe, expect, it, beforeAll, afterAll } from '@jest/globals';
import fs from 'fs-extra';
import path from 'upath';
import getChecksum from '../../src/utils/hash/getChecksum.js';

describe('getChecksum', () => {
  const testDir = path.join(process.cwd(), 'tmp', 'checksum-test');
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

  it('should return a consistent checksum for the same files', async () => {
    const checksum1 = await getChecksum(fileA, fileB);
    const checksum2 = await getChecksum(fileA, fileB);
    expect(checksum1).toBe(checksum2);
  });

  it('should return a different checksum if file content changes', async () => {
    const checksum1 = await getChecksum(fileA, fileB);
    fs.writeFileSync(fileA, 'changed content');
    const checksum2 = await getChecksum(fileA, fileB);
    expect(checksum1).not.toBe(checksum2);
  });

  it('should include all files in a directory', async () => {
    const checksumDir = await getChecksum(testDir);
    const checksumFiles = await getChecksum(fileA, fileB);
    expect(checksumDir).toBe(checksumFiles);
  });

  it('should handle glob patterns', async () => {
    const pattern = path.join(testDir, '*.txt');
    const checksumPattern = await getChecksum(pattern);
    const checksumFiles = await getChecksum(fileA, fileB);
    expect(checksumPattern).toBe(checksumFiles);
  });
});
