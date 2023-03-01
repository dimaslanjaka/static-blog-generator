import { describe, expect, test } from '@jest/globals';
import fs from 'fs-extra';
import * as wilcards from '../src';

describe('promisify', () => {
  test('sync fn', () => {
    const readFile = wilcards.promisify(fs.readFileSync);
    readFile(__filename, 'utf8').then(function (contents) {
      // const firstLine = contents.split('\n')[0];
      expect(String(contents).includes('@jest/globals')).toBe(true);
    });
  });
  test('async fn', () => {
    const readFile = wilcards.promisify(fs.readFile);
    readFile(__filename).then(function (contents) {
      // const firstLine = contents.split('\n')[0];
      expect(String(contents).includes('@jest/globals')).toBe(true);
    });
  });
});
