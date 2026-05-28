import fs from 'node:fs';
import path from 'node:path';
import { SQLite } from '../../db/sqlite';
import { getPostsByArchive } from './queries';
import { renderTemplate } from '../renderer';

function getArchiveKeys(db: SQLite) {
  return db.all<{ key: string }>(`
    SELECT DISTINCT target_key as key
    FROM dependencies
    WHERE target_type = 'archive'
  `);
}

export function generateArchivePages(db: SQLite, themeDir: string, outDir: string) {
  const archives = getArchiveKeys(db);

  for (const a of archives) {
    const posts = getPostsByArchive(db, a.key);

    const html = renderTemplate('ejs', path.join(themeDir, 'archive.ejs'), {
      archive: a.key,
      posts
    });

    const outPath = path.join(outDir, 'archives', a.key, 'index.html');

    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, html);
  }
}
