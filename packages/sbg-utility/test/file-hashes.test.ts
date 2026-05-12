import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';
import fs from 'fs-extra';
import os from 'os';
import path from 'path';

import { createFileHashes, getFileTreeString, getTree } from '../../src';

describe('createFileHashes', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'file-hashes-test-'));
  });

  afterEach(async () => {
    await fs.remove(tempDir);
  });

  it('creates hashes for matching file extensions', async () => {
    await fs.outputFile(path.join(tempDir, 'index.js'), 'console.log("hello");');

    await fs.outputFile(path.join(tempDir, 'script.py'), 'print("hello")');

    await fs.outputFile(path.join(tempDir, 'README.md'), '# ignored');

    const result = await createFileHashes({
      projectDir: tempDir
    });

    expect(result['index.js']).toBeDefined();
    expect(result['script.py']).toBeDefined();
    expect(result['README.md']).toBeUndefined();

    expect(result['index.js']).toMatch(/^[a-f0-9]{8}$/);
    expect(result['script.py']).toMatch(/^[a-f0-9]{8}$/);
  });

  it('supports custom extensions', async () => {
    await fs.outputFile(path.join(tempDir, 'README.md'), '# hello');

    const result = await createFileHashes({
      projectDir: tempDir,
      extensions: ['md']
    });

    expect(result['README.md']).toBeDefined();
  });

  it('excludes directories', async () => {
    await fs.outputFile(path.join(tempDir, 'src/index.js'), 'hello');

    await fs.outputFile(path.join(tempDir, 'node_modules/dummy-pkg/index.js'), 'ignored');

    const result = await createFileHashes({
      projectDir: tempDir,
      excludeDirs: ['node_modules']
    });

    expect(result['src/index.js']).toBeDefined();

    expect(result['node_modules/dummy-pkg/index.js']).toBeUndefined();
  });

  it('includes extra files', async () => {
    const extraFile = path.join(tempDir, 'extra.txt');

    await fs.outputFile(extraFile, 'extra');

    const result = await createFileHashes({
      projectDir: tempDir,
      extensions: [],
      extraFiles: [extraFile]
    });

    expect(result['extra.txt']).toBeDefined();
  });

  it('supports absolute paths', async () => {
    const filePath = path.join(tempDir, 'index.js');

    await fs.outputFile(filePath, 'hello');

    const result = await createFileHashes({
      projectDir: tempDir,
      absolutePaths: true
    });

    const normalized = path.resolve(filePath).split(path.sep).join('/');

    expect(result[normalized]).toBeDefined();
  });

  it('returns sorted keys', async () => {
    await fs.outputFile(path.join(tempDir, 'b.js'), 'b');

    await fs.outputFile(path.join(tempDir, 'a.js'), 'a');

    const result = await createFileHashes({
      projectDir: tempDir
    });

    expect(Object.keys(result)).toEqual(['a.js', 'b.js']);
  });

  it('ignores missing extra files', async () => {
    const missingFile = path.join(tempDir, 'missing.js');

    await expect(
      createFileHashes({
        projectDir: tempDir,
        extraFiles: [missingFile]
      })
    ).resolves.not.toThrow();
  });
});

describe('getFileTreeString', () => {
  it('creates a formatted tree string', () => {
    const hashMap = {
      'src/index.js': '12345678',
      'src/utils/helper.js': 'abcdef12',
      'README.md': 'deadbeef'
    };

    const tree = getFileTreeString(hashMap);

    expect(tree).toContain('README.md [deadbeef]');

    expect(tree).toContain('src/');

    expect(tree).toContain('index.js [12345678]');

    expect(tree).toContain('helper.js [abcdef12]');
  });

  it('returns identical output via getTree alias', () => {
    const hashMap = {
      'index.js': '12345678'
    };

    expect(getTree(hashMap)).toBe(getFileTreeString(hashMap));
  });

  it('returns empty string for empty hash map', () => {
    expect(getFileTreeString({})).toBe('');
  });
});
