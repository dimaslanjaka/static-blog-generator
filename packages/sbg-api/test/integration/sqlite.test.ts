import fs from 'node:fs';
import path from 'node:path';
import { SQLite } from '../../src/db/sqlite';
import { beforeEach, afterAll, expect, test, describe } from '@jest/globals';

const TEST_DB = path.join(process.cwd(), 'tmp/data', 'test.sqlite');
const SCHEMA_FILE = path.join(process.cwd(), 'src', 'db', 'schema.sql');

describe('SQLite', () => {
  beforeEach(() => {
    // clean test db before each run
    if (fs.existsSync(TEST_DB)) {
      fs.unlinkSync(TEST_DB);
    }
  });

  afterAll(() => {
    if (fs.existsSync(TEST_DB)) {
      fs.unlinkSync(TEST_DB);
    }
  });

  test('should load real schema.sql successfully', () => {
    const db = new SQLite(TEST_DB);

    expect(() => {
      db.migrate(SCHEMA_FILE);
    }).not.toThrow();

    const tables = db.all<{ name: string }>(`SELECT name FROM sqlite_master WHERE type='table'`);

    expect(tables.length).toBeGreaterThan(0);

    db.close();
  });

  test('should insert into posts table (real schema)', () => {
    const db = new SQLite(TEST_DB);
    db.migrate(SCHEMA_FILE);

    db.run(
      `INSERT INTO posts (title, slug, path, content_raw, hash)
     VALUES (@title, @slug, @path, @content_raw, @hash)`,
      {
        title: 'Hello World',
        slug: 'hello-world',
        path: 'source/_posts/hello.md',
        content_raw: '# Hello',
        hash: 'hash123'
      }
    );

    const post = db.get<{ title: string }>(`SELECT * FROM posts WHERE slug = @slug`, { slug: 'hello-world' });

    expect(post?.title).toBe('Hello World');

    db.close();
  });

  test('should fetch posts from real schema', () => {
    const db = new SQLite(TEST_DB);
    db.migrate(SCHEMA_FILE);

    db.run(
      `INSERT INTO posts (title, slug, path, content_raw, hash)
     VALUES (@t, @s, @p, @c, @h)`,
      {
        t: 'A',
        s: 'a',
        p: 'a.md',
        c: 'A',
        h: '1'
      }
    );

    const posts = db.all(`SELECT * FROM posts`);

    expect(posts.length).toBe(1);

    db.close();
  });

  test('should commit transaction using real schema', () => {
    const db = new SQLite(TEST_DB);
    db.migrate(SCHEMA_FILE);

    db.transaction(() => {
      db.run(
        `INSERT INTO posts (title, slug, path, content_raw, hash)
       VALUES (@t, @s, @p, @c, @h)`,
        { t: 'TX1', s: 'tx1', p: 't1.md', c: 'c', h: '1' }
      );

      db.run(
        `INSERT INTO posts (title, slug, path, content_raw, hash)
       VALUES (@t, @s, @p, @c, @h)`,
        { t: 'TX2', s: 'tx2', p: 't2.md', c: 'c', h: '2' }
      );
    });

    const rows = db.all(`SELECT * FROM posts`);
    expect(rows.length).toBe(2);

    db.close();
  });
});
