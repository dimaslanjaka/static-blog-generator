import { beforeEach, describe, expect, test } from '@jest/globals';
import url from 'node:url';
import path from 'upath';
import {
  commonIgnore as srcCommonIgnore,
  deployConfig as srcDeployConfig,
  fetchConfig as srcFetchConfig,
  getConfig as srcGetConfig,
  projectIgnores as srcProjectIgnores,
  setConfig as srcSetConfig
} from '../../src/config/_config';

import {
  commonIgnore as distCommonIgnore,
  deployConfig as distDeployConfig,
  fetchConfig as distFetchConfig,
  getConfig as distGetConfig,
  projectIgnores as distProjectIgnores,
  setConfig as distSetConfig
} from '../../dist/config/_config';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to main config file
const mainConfigPath = path.join(__dirname, '../_config.yml');

describe('config/_config (src)', () => {
  const projectRoot = path.resolve(__dirname, '../../');
  const cwd = path.join(projectRoot, 'test');
  process.cwd = () => cwd;

  beforeEach(() => {
    srcFetchConfig(mainConfigPath);
    srcSetConfig({ cwd });
  });

  test('fetchConfig loads YAML and sets config', () => {
    srcSetConfig({
      tags: { lowercase: true },
      categories: { lowercase: true }
    });
    const config = srcGetConfig();
    expect(config.post_dir).toBe('src-posts');
    expect(config.deploy_dir).toBeDefined();
    expect(config.cwd).toBe(cwd);
    expect(config.generator.cache).toBe(true);
    expect(config.tags?.lowercase).toBe(true);
    expect(config.categories?.lowercase).toBe(true);
  });

  test('setConfig and getConfig work as expected', () => {
    srcSetConfig({ post_dir: 'other', generator: { cache: false, verbose: true } });
    const config = srcGetConfig();
    expect(config.post_dir).toBe('other');
    expect(config.generator.cache).toBe(false);
    expect(config.generator.verbose).toBe(true);
  });

  test('deployConfig returns correct deployDir', () => {
    srcSetConfig({ deploy_dir: '/custom/dir', cwd: __dirname, deploy: { type: 'git' } });
    const deploy = srcDeployConfig();
    expect(deploy.deployDir).toBe('/custom/dir');
  });

  test('commonIgnore and projectIgnores are arrays', () => {
    expect(Array.isArray(srcCommonIgnore)).toBe(true);
    expect(Array.isArray(srcProjectIgnores)).toBe(true);
  });
});

describe('config/_config (dist)', () => {
  const projectRoot = path.resolve(__dirname, '../../');
  const cwd = path.join(projectRoot, 'test');
  process.cwd = () => cwd;

  beforeEach(() => {
    distFetchConfig(mainConfigPath);
    distSetConfig({ cwd });
  });

  test('fetchConfig loads YAML and sets config', () => {
    distSetConfig({
      tags: { lowercase: true },
      categories: { lowercase: true }
    });
    const config = distGetConfig();
    expect(config.post_dir).toBe('src-posts');
    expect(config.deploy_dir).toBeDefined();
    expect(config.cwd).toBe(cwd);
    expect(config.generator.cache).toBe(true);
    expect(config.tags?.lowercase).toBe(true);
    expect(config.categories?.lowercase).toBe(true);
  });

  test('setConfig and getConfig work as expected', () => {
    distSetConfig({ post_dir: 'other', generator: { cache: false, verbose: true } });
    const config = distGetConfig();
    expect(config.post_dir).toBe('other');
    expect(config.generator.cache).toBe(false);
    expect(config.generator.verbose).toBe(true);
  });

  test('deployConfig returns correct deployDir', () => {
    distSetConfig({ deploy_dir: '/custom/dir', cwd: __dirname, deploy: { type: 'git' } });
    const deploy = distDeployConfig();
    expect(deploy.deployDir).toBe('/custom/dir');
  });

  test('commonIgnore and projectIgnores are arrays', () => {
    expect(Array.isArray(distCommonIgnore)).toBe(true);
    expect(Array.isArray(distProjectIgnores)).toBe(true);
  });
});
