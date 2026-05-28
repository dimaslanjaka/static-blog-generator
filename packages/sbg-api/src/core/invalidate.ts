import { SQLite } from '../db/sqlite';

export function getAffectedTargets(db: SQLite, sourceSlug: string) {
  const rows = db.all(
    `
    SELECT target_type, target_key
    FROM dependencies
    WHERE source_slug = @slug
    `,
    { slug: sourceSlug }
  );

  return rows;
}
