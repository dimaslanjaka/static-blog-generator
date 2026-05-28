import { SQLite } from '../../db/sqlite';

export const markdownStep = (db: SQLite) => async (ctx: any) => {
  const posts = db.all(`SELECT * FROM posts`);
  const pages = db.all(`SELECT * FROM pages`);

  return {
    ...ctx,
    posts,
    pages
  };
};
