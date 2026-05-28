import { SQLite } from '../../db/sqlite';
import { generateTagPages } from './tags';
import { generateCategoryPages } from './categories';
import { generateArchivePages } from './archives';
import { generatePaginationPages } from './pagination';

export function generateDerivedPages(db: SQLite, themeDir: string, outDir: string) {
  generateTagPages(db, themeDir, outDir);
  generateCategoryPages(db, themeDir, outDir);
  generateArchivePages(db, themeDir, outDir);
  generatePaginationPages(db, themeDir, outDir);
}
