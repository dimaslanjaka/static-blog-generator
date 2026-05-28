import fs from 'node:fs';
import path from 'node:path';
import { SQLite } from '../../db/sqlite';
import { getPostsByCategory } from './queries';
import { renderTemplate } from '../renderer';

export function generateCategoryPages(db: SQLite, themeDir: string, outDir: string) {
  const categories = db.all<{ key: string }>(`
    SELECT DISTINCT target_key as key
    FROM dependencies
    WHERE target_type = 'category'
  `);

  for (const cat of categories) {
    const posts = getPostsByCategory(db, cat.key);

    const html = renderTemplate('ejs', path.join(themeDir, 'category.ejs'), {
      category: cat.key,
      posts
    });

    const outPath = path.join(outDir, 'categories', cat.key, 'index.html');

    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, html);
  }
}
