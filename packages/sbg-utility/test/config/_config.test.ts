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

/**
 * Runs config tests for a given config module.
 * @param label Test suite label
 * @param mod Config module functions/objects
 */
function runConfigTests(
  label: string,
  mod: {
    fetchConfig: (path: string) => void;
    setConfig: (cfg: any) => void;
    getConfig: () => any;
    deployConfig: () => any;
    commonIgnore: unknown;
    projectIgnores: unknown;
  }
) {
  describe(label, () => {
    const projectRoot = path.resolve(__dirname, '../../');
    const cwd = path.join(projectRoot, 'test');
    process.cwd = () => cwd;

    beforeEach(() => {
      mod.fetchConfig(mainConfigPath);
      mod.setConfig({ cwd });
    });

    test('fetchConfig loads YAML and sets config', () => {
      mod.setConfig({
        tags: { lowercase: true },
        categories: { lowercase: true }
      });
      const config = mod.getConfig();
      expect(config.post_dir).toBe('src-posts');
      expect(config.deploy_dir).toBeDefined();
      expect(config.cwd).toBe(cwd);
      expect(config.generator.cache).toBe(true);
      expect(config.tags?.lowercase).toBe(true);
      expect(config.categories?.lowercase).toBe(true);
    });

    test('setConfig and getConfig work as expected', () => {
      mod.setConfig({ post_dir: 'other', generator: { cache: false, verbose: true } });
      const config = mod.getConfig();
      expect(config.post_dir).toBe('other');
      expect(config.generator.cache).toBe(false);
      expect(config.generator.verbose).toBe(true);
    });

    test('deployConfig returns correct deployDir', () => {
      mod.setConfig({ deploy_dir: '/custom/dir', cwd: __dirname, deploy: { type: 'git' } });
      const deploy = mod.deployConfig();
      expect(deploy.deployDir).toBe('/custom/dir');
    });

    test('commonIgnore and projectIgnores are arrays', () => {
      expect(Array.isArray(mod.commonIgnore)).toBe(true);
      expect(Array.isArray(mod.projectIgnores)).toBe(true);
    });
  });
}

runConfigTests('config/_config (src)', {
  fetchConfig: srcFetchConfig,
  setConfig: srcSetConfig,
  getConfig: srcGetConfig,
  deployConfig: srcDeployConfig,
  commonIgnore: srcCommonIgnore,
  projectIgnores: srcProjectIgnores
});

runConfigTests('config/_config (dist)', {
  fetchConfig: distFetchConfig,
  setConfig: distSetConfig,
  getConfig: distGetConfig,
  deployConfig: distDeployConfig,
  commonIgnore: distCommonIgnore,
  projectIgnores: distProjectIgnores
});
