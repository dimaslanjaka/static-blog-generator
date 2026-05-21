import { describe, expect, test } from '@jest/globals';
import fs from 'fs';
import { LocalStorage } from '../../../src/utils/LocalStorage.js';

describe('LocalStorage', () => {
  test('file exists error', () => {
    fs.writeFileSync('./tmp/scratchFile', 'hello', 'utf8');

    try {
      expect(() => {
        new LocalStorage('./tmp/scratchFile');
      }).toThrow(Error);
    } finally {
      fs.unlinkSync('./tmp/scratchFile');
    }
  });
});
