import fs from 'node:fs';
import path from 'node:path';
import * as cp from 'cross-spawn';
import { beforeAll, describe, expect, test } from '@jest/globals';
import { Builder } from '../../src/core/builder';
import { useSQLite } from '../helpers/sqlite';

const ROOT = process.cwd();

const PATHS = {
  source: path.join(ROOT, 'test/fixtures/source'),
  out: path.join(ROOT, 'test/fixtures/public'),
  theme: path.join(ROOT, 'test/fixtures/themes/default'),
  copyScript: path.join(ROOT, 'test/fixtures/use-source-original.mjs')
};

describe('Builder', () => {
  const sqlite = useSQLite();

  const resetFixtures = () => {
    cp.sync(
      'run-c',
      ['--exec', PATHS.copyScript, '--pattern', 'test/fixtures/source/**/*.md', '--ignore', '**/_*/**'],
      {
        stdio: 'inherit'
      }
    );
  };

  beforeAll(() => {
    resetFixtures();
  });

  test('full build pipeline should generate output', async () => {
    if (fs.existsSync(PATHS.out)) {
      fs.rmSync(PATHS.out, {
        recursive: true,
        force: true
      });
    }

    const builder = new Builder(sqlite.db, PATHS.source, PATHS.out, PATHS.theme);

    await builder.build();

    expect(fs.existsSync(path.join(PATHS.out, 'posts'))).toBe(true);

    expect(fs.existsSync(path.join(PATHS.out, 'index.html'))).toBe(true);
  });
});
