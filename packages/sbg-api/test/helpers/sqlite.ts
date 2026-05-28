import fs from 'node:fs';
import path from 'node:path';

import { beforeEach, afterEach } from '@jest/globals';

import { SQLite } from '../../src/db/sqlite';

const ROOT = process.cwd();

export const TEST_PATHS = {
  db: path.join(ROOT, 'data/test/test.sqlite'),
  schema: path.join(ROOT, 'src/db/schema.sql')
};

export interface SQLiteContext {
  db: SQLite;
}

export function useSQLite(deleteDb: boolean = false): SQLiteContext {
  const ctx = {} as SQLiteContext;

  beforeEach(() => {
    if (fs.existsSync(TEST_PATHS.db)) {
      fs.rmSync(TEST_PATHS.db, {
        force: true
      });
    }

    ctx.db = new SQLite(TEST_PATHS.db);
    ctx.db.migrate(TEST_PATHS.schema);
  });

  afterEach(() => {
    ctx.db.close();

    if (deleteDb && fs.existsSync(TEST_PATHS.db)) {
      fs.rmSync(TEST_PATHS.db, {
        force: true
      });
    }
  });

  return ctx;
}
