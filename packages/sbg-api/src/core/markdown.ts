import { parsePost as parse } from 'hexo-post-parser';
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt('commonmark', {
  html: true,
  linkify: true,
  typographer: true
});

export type ParsedMarkdown = {
  frontmatter: Record<string, any>;
  html: string;
  excerpt: string;
  rawContent: string;
};

/**
 * Generate safe excerpt from HTML
 */
function generateExcerpt(html: string, length = 160) {
  const text = html.replace(/<[^>]*>/g, '');
  return text.slice(0, length).trim();
}

/**
 * Hexo-compatible async markdown pipeline
 */
export async function parseMarkdown(raw: string, filePath?: string): Promise<ParsedMarkdown> {
  // 1. Async Hexo-style parsing
  const result = await parse(raw, filePath ? { sourceFile: filePath } : { shortcodes: false });

  const frontmatter = result?.data || {};
  const content = result?.content || '';

  // 2. Markdown → HTML
  const html = md.render(content, {});

  // 3. Excerpt priority
  const excerpt = frontmatter.excerpt || generateExcerpt(html);

  return {
    frontmatter,
    html,
    excerpt,
    rawContent: content
  };
}
