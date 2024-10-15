import { describe, expect, test } from '@jest/globals';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { promisify } from '../src/utils/promisify';

// this is promisify wrapper test

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('promisify', () => {
  test('sync fn', () => {
    const readFile = promisify(fs.readFileSync);
    readFile(__filename, 'utf-8').then(function (contents) {
      expect(String(contents).includes('this is promisify wrapper test')).toBe(true);
    });
  });
  test('async fn', () => {
    const readFile = promisify(fs.readFile);
    readFile(__filename).then(function (contents) {
      expect(String(contents).includes('this is promisify wrapper test')).toBe(true);
    });
  });
});
