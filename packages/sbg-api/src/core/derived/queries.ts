import { SQLite } from '../../db/sqlite';

/**
 * Get all posts with minimal fields for derived generation
 */
export function getAllPosts(db: SQLite) {
  return db.all<any>(`
    SELECT id, title, slug, created_at, content_html
    FROM posts
    ORDER BY datetime(created_at) DESC
  `);
}

/**
 * Get posts by tag (via dependency graph)
 */
export function getPostsByTag(db: SQLite, tag: string) {
  return db.all<any>(
    `
    SELECT p.*
    FROM posts p
    JOIN dependencies d
      ON d.source_slug = p.slug
    WHERE d.target_type = 'tag'
      AND d.target_key = @tag
    ORDER BY datetime(p.created_at) DESC
    `,
    { tag }
  );
}

/**
 * Get posts by category
 */
export function getPostsByCategory(db: SQLite, category: string) {
  return db.all<any>(
    `
    SELECT p.*
    FROM posts p
    JOIN dependencies d
      ON d.source_slug = p.slug
    WHERE d.target_type = 'category'
      AND d.target_key = @category
    ORDER BY datetime(p.created_at) DESC
    `,
    { category }
  );
}

/**
 * Get archive posts (YYYY-MM)
 */
export function getPostsByArchive(db: SQLite, key: string) {
  return db.all<any>(
    `
    SELECT p.*
    FROM posts p
    JOIN dependencies d
      ON d.source_slug = p.slug
    WHERE d.target_type = 'archive'
      AND d.target_key = @key
    ORDER BY datetime(p.created_at) DESC
    `,
    { key }
  );
}
