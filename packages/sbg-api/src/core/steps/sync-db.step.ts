import { syncPages } from '../../loaders/pages';
import { syncPosts } from '../../loaders/posts';

export const syncDbStep = (db: any) => async (ctx: any) => {
  await syncPosts(db, ctx.postsFiles);
  await syncPages(db, ctx.pagesFiles);

  return ctx;
};
