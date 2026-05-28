import fs from 'node:fs';
import path from 'node:path';
import { SQLite } from '../../db/sqlite';
import { getPostsByTag } from './queries';
import { renderTemplate } from '../renderer';

export function generateTagPages(db: SQLite, themeDir: string, outDir: string) {
  const tags = db.all<{ key: string }>(`
    SELECT DISTINCT target_key as key
    FROM dependencies
    WHERE target_type = 'tag'
  `);

  for (const tag of tags) {
    const posts = getPostsByTag(db, tag.key);

    const html = renderTemplate('ejs', path.join(themeDir, 'tag.ejs'), {
      tag: tag.key,
      posts
    });

    const outPath = path.join(outDir, 'tags', tag.key, 'index.html');

    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, html);
  }
}
