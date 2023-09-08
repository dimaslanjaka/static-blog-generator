import { describe, expect, test } from '@jest/globals';
import fs from 'fs-extra';
import * as wilcards from '../src';

// this is promisify wrapper test

describe('promisify', () => {
  test('sync fn', () => {
    const readFile = wilcards.promisify(fs.readFileSync);
    readFile(__filename, 'utf8').then(function (contents) {
      expect(String(contents).includes('this is promisify wrapper test')).toBe(true);
    });
  });
  test('async fn', () => {
    const readFile = wilcards.promisify(fs.readFile);
    readFile(__filename).then(function (contents) {
      expect(String(contents).includes('this is promisify wrapper test')).toBe(true);
    });
  });
});
