import path from 'node:path';
import { renderTemplate } from '../renderer';

export const renderStep = (themeDir: string) => async (ctx: any) => {
  const rendered: any[] = [];

  for (const post of ctx.posts) {
    const html = renderTemplate('ejs', path.join(themeDir, 'post.ejs'), { post });

    rendered.push({
      path: `/posts/${post.slug}/index.html`,
      html
    });
  }

  for (const page of ctx.pages) {
    const html = renderTemplate('ejs', path.join(themeDir, 'page.ejs'), { page });

    rendered.push({
      path: `/${page.slug}/index.html`,
      html
    });
  }

  return { ...ctx, rendered };
};
