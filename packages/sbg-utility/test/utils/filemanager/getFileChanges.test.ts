import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import fs from 'fs-extra';
import path from 'upath';
import getFileChanges from '../../../src/utils/filemanager/getFileChanges.js';

const cacheDir = path.join(process.cwd(), 'tmp', 'sbg-utility', 'getFileChanges');

describe('getFileChanges self-exclusion', () => {
  const tmpTestDir = path.join(process.cwd(), 'tmp', 'test-getfilechanges');
  const tempFile = path.join(tmpTestDir, 'a.ts');

  beforeAll(() => {
    // ensure no stale cache interferes with the test
    if (fs.existsSync(cacheDir)) fs.removeSync(cacheDir);
    // create temp file used as the scan target
    fs.ensureDirSync(tmpTestDir);
    fs.writeFileSync(tempFile, 'export const TEMP = 1;\n');
  });

  afterAll(() => {
    if (fs.existsSync(cacheDir)) fs.removeSync(cacheDir);
    if (fs.existsSync(tmpTestDir)) fs.removeSync(tmpTestDir);
  });

  it('does not report its own source file as changed', async () => {
    const target = 'src/utils/filemanager/getFileChanges.ts';

    const result = await getFileChanges({ patterns: [target], cwd: process.cwd(), ignorePatterns: [] } as any);

    const includesTarget = result.changedFiles.some((f) => f.file === target);
    // getFileChanges should exclude its own source file
    expect(includesTarget).toBe(false);
  }, 20000);

  it('file should not be changed on second step', async () => {
    const target = path.toUnix(path.relative(process.cwd(), tempFile));

    // first run creates the cache and should report the temp file as changed
    const first = await getFileChanges({ patterns: [target], cwd: process.cwd(), ignorePatterns: [] } as any);

    // second run should read cache and report no changes
    const second = await getFileChanges({ patterns: [target], cwd: process.cwd(), ignorePatterns: [] } as any);

    const includesFirst = first.changedFiles.some((f) => f.file === target);
    const includesSecond = second.changedFiles.some((f) => f.file === target);

    expect(includesFirst).toBe(true);
    expect(includesSecond).toBe(false);
    // second.result should be false because cache exists and there are no changed files
    expect(second.result).toBe(false);
  }, 20000);
});

export {};
