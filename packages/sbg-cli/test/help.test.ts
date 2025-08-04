///
import { testCwd } from './env';
process.cwd = () => testCwd;
///

import { describe, expect, it } from '@jest/globals';
import { tsCmd } from './utils/cmd';

describe('test CLI usage', () => {
  it('without args', async () => {
    const spy = await tsCmd('');
    expect(spy).toEqual(expect.stringContaining('usage: sbg <command>'));
  }, 60000);
  it('help', async () => {
    const spy = await tsCmd('help');
    expect(spy).toEqual(expect.stringContaining('Show help'));
  }, 60000);
  it('post without option', async () => {
    const spy = await tsCmd('post');
    expect(spy).toEqual(expect.stringContaining('Not enough non-option arguments: got 0, need at least 1'));
  }, 600000);
});
