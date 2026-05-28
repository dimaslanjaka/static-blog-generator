import ejs from 'ejs';
import fs from 'node:fs';

export type TemplateEngine = 'ejs' | 'nunjucks' | 'pug';

export function renderTemplate(engine: TemplateEngine, templatePath: string, data: any): string {
  const tpl = fs.readFileSync(templatePath, 'utf-8');

  switch (engine) {
    case 'ejs':
      return ejs.render(tpl, data);

    case 'nunjucks': {
      const nunjucks = require('nunjucks');
      return nunjucks.renderString(tpl, data);
    }

    case 'pug': {
      const pug = require('pug');
      return pug.compile(tpl)(data);
    }

    default:
      throw new Error(`Unsupported engine: ${engine}`);
  }
}
