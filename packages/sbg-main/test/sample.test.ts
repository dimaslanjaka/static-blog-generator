import cmd from './utils/cmd';

describe('mock usage', () => {
  it('should show help', async () => {
    const spy = await cmd('help');
    expect(spy).toEqual(expect.stringContaining('usage: sbg <command>'));
  }, 30000);
});
