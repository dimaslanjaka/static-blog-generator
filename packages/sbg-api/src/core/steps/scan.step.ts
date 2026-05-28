import { scanDir } from '../scanner';
import path from 'node:path';

export const scanStep = (sourceDir: string) => async (ctx: any) => {
  const postsDir = path.join(sourceDir, '_posts');

  const posts = scanDir(postsDir);
  const pages = scanDir(sourceDir).filter((f) => !f.includes('_posts'));

  return {
    ...ctx,
    files: [...posts, ...pages],
    postsFiles: posts,
    pagesFiles: pages
  };
};
