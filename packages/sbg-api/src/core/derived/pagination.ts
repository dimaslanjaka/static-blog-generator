import fs from 'node:fs';
import path from 'node:path';
import { SQLite } from '../../db/sqlite';
import { renderTemplate } from '../renderer';

export function paginate<T>(items: T[], perPage: number) {
  const pages: T[][] = [];

  for (let i = 0; i < items.length; i += perPage) {
    pages.push(items.slice(i, i + perPage));
  }

  return pages;
}

export function generatePaginationPages(db: SQLite, themeDir: string, outDir: string, perPage = 5) {
  const posts = db.all(`
    SELECT * FROM posts
    ORDER BY datetime(created_at) DESC
  `);

  const pages = paginate(posts, perPage);

  pages.forEach((chunk, index) => {
    const html = renderTemplate('ejs', path.join(themeDir, 'index.ejs'), {
      posts: chunk,
      currentPage: index + 1,
      totalPages: pages.length
    });

    const outPath =
      index === 0 ? path.join(outDir, 'index.html') : path.join(outDir, 'page', String(index + 1), 'index.html');

    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, html);
  });
}
