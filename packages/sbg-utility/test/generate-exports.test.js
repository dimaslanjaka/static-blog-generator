import { jest } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import { generateExports } from '../src/utils/generate-exports.js';

const testPkgPath = path.join(process.cwd(), 'tmp/package.json');
const distUtils = path.join(process.cwd(), 'dist/utils');

// Helper to create dummy files
function createDummyFiles() {
  if (!fs.existsSync(distUtils)) fs.mkdirSync(distUtils, { recursive: true });

  // Original dummy files
  fs.writeFileSync(path.join(distUtils, 'dummy.mjs'), 'export default {}');
  fs.writeFileSync(path.join(distUtils, 'dummy.cjs'), 'module.exports = {}');
  fs.writeFileSync(path.join(distUtils, 'dummy.d.ts'), 'export type Dummy = {}');

  // Additional dummy files
  fs.writeFileSync(path.join(distUtils, 'dummy2.mjs'), 'export default {}');
  fs.writeFileSync(path.join(distUtils, 'dummy2.cjs'), 'module.exports = {}');
  fs.writeFileSync(path.join(distUtils, 'dummy2.d.ts'), 'export type Dummy2 = {}');
  fs.writeFileSync(path.join(distUtils, 'dummy2.d.mts'), 'export type Dummy2 = {}');
  fs.writeFileSync(path.join(distUtils, 'dummy2.d.cts'), 'export type Dummy2 = {}');
}

describe('generateExports', () => {
  let consoleLogSpy;

  beforeAll(() => {
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    // Create dummy package.json and files
    fs.mkdirSync(path.dirname(testPkgPath), { recursive: true });
    fs.writeFileSync(testPkgPath, JSON.stringify({ name: 'test', exports: {} }, null, 2));
    createDummyFiles();
  });

  afterAll(() => {
    consoleLogSpy.mockRestore();
  });

  beforeEach(() => {
    generateExports({ pkgPath: testPkgPath, useDefaultFolders: true, useDefaultExport: true });
  });

  it('should generate correct export for dummy.mjs with types', () => {
    const pkg = JSON.parse(fs.readFileSync(testPkgPath, 'utf8'));
    expect(pkg.exports['./dist/utils/dummy.mjs']).toEqual({
      import: './dist/utils/dummy.mjs',
      types: './dist/utils/dummy.d.ts'
    });
  });

  it('should generate correct export for dummy.cjs with types', () => {
    const pkg = JSON.parse(fs.readFileSync(testPkgPath, 'utf8'));
    expect(pkg.exports['./dist/utils/dummy.cjs']).toEqual({
      require: './dist/utils/dummy.cjs',
      types: './dist/utils/dummy.d.ts'
    });
  });

  it('should generate correct export for dummy subpath with types', () => {
    const pkg = JSON.parse(fs.readFileSync(testPkgPath, 'utf8'));
    expect(pkg.exports['./dist/utils/dummy']).toEqual({
      import: './dist/utils/dummy.mjs',
      require: './dist/utils/dummy.cjs',
      types: './dist/utils/dummy.d.ts'
    });
  });

  it('should generate correct export for dummy2.mjs with types', () => {
    const pkg = JSON.parse(fs.readFileSync(testPkgPath, 'utf8'));
    expect(pkg.exports['./dist/utils/dummy2.mjs']).toEqual({
      import: './dist/utils/dummy2.mjs',
      types: './dist/utils/dummy2.d.mts'
    });
  });

  it('should generate correct export for dummy2.cjs with types', () => {
    const pkg = JSON.parse(fs.readFileSync(testPkgPath, 'utf8'));
    expect(pkg.exports['./dist/utils/dummy2.cjs']).toEqual({
      require: './dist/utils/dummy2.cjs',
      types: './dist/utils/dummy2.d.cts'
    });
  });

  it('should generate correct export for dummy2 subpath with types', () => {
    const pkg = JSON.parse(fs.readFileSync(testPkgPath, 'utf8'));
    expect(pkg.exports['./dist/utils/dummy2']).toEqual({
      import: './dist/utils/dummy2.mjs',
      require: './dist/utils/dummy2.cjs',
      types: './dist/utils/dummy2.d.ts'
    });
  });
});
