import { ParsedMarkdown } from './markdown';

export type Dependency = {
  type: 'tag' | 'category' | 'archive' | 'home';
  key: string;
};

export function extractDependencies(slug: string, parsed: ParsedMarkdown): Dependency[] {
  const deps: Dependency[] = [];

  const fm = parsed.frontmatter;

  // 🏷 tags
  if (Array.isArray(fm.tags)) {
    for (const tag of fm.tags) {
      deps.push({ type: 'tag', key: tag });
    }
  }

  // 📂 category
  if (fm.category) {
    deps.push({ type: 'category', key: fm.category });
  }

  // 📅 archive (by date if exists)
  if (fm.date) {
    const d = new Date(fm.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    deps.push({ type: 'archive', key });
  }

  // 🏠 homepage always depends on posts
  deps.push({ type: 'home', key: 'index' });

  return deps;
}
