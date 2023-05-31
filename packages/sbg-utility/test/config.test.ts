import { beforeAll, describe, it } from '@jest/globals';
import spawn from 'cross-spawn';
import { resolve } from 'upath';
import { deployConfig, fetchConfig, getConfig, setConfig } from '../src';
import findYarnRootWorkspace from '../src/utils/findYarnRootWorkspace';

describe('CONFIG', function () {
  let testCwd: string | undefined = '';
  beforeAll(async function () {
    const rootWorkspace = findYarnRootWorkspace({ base_dir: resolve(__dirname, '..') });
    const listWorkspaces = await spawn
      .async('yarn', 'workspaces list --json'.split(' '), { cwd: resolve(__dirname, '..'), shell: true })
      .then((res) =>
        res.stdout
          .split(/\r?\n/gm)
          .map((str) => str.length > 10 && (JSON.parse(str.trim()) as { name: string; location: string }))
          .map((o) => {
            if (!o) return undefined;
            o.location = resolve(rootWorkspace, o.location);
            return o;
          })
      );
    testCwd = listWorkspaces.filter((o) => o?.name === 'test')[0]?.location;
  }, 70000);

  it('fetchConfig()', function () {
    expect(() => fetchConfig(__dirname)).toThrow('ENOENT: no such file or directory');
    expect(() => fetchConfig(testCwd)).not.toThrow('ENOENT: no such file or directory');
  }, 70000);

  it('setConfig()', function () {
    expect(() => setConfig({ silent: true })).not.toThrow();
  }, 70000);

  it('deployConfig()', function () {
    expect(typeof deployConfig).toBe('function');
    const cfg = deployConfig();
    expect(cfg).toHaveProperty('github');
    expect(cfg).toHaveProperty('deployDir');
  }, 70000);

  it('getConfig()', () => {
    expect(typeof getConfig).toBe('function');
    const cfg = getConfig();
    expect(cfg).toHaveProperty('title');
    expect(cfg).toHaveProperty('url');
  }, 70000);
});
