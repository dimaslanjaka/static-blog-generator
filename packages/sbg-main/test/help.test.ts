///
import { testCwd } from './env';
process.cwd = () => testCwd;
///

import cmd from './utils/cmd';

describe('mock CLI usage', () => {
  it('without args', async () => {
    const spy = await cmd('');
    expect(spy).toEqual(expect.stringContaining('usage: sbg <command>'));
  }, 30000);
  it('help', async () => {
    const spy = await cmd('help');
    expect(spy).toEqual(expect.stringContaining('Show help'));
  }, 30000);
  it('post without subcommand', async () => {
    const spy = await cmd('post');
    expect(spy).toEqual(expect.stringContaining('Positionals:'));
  }, 30000);
});
