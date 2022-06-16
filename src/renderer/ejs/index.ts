/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import * as ejs from 'ejs';
import { join } from '../../node/filemanager';
import { postMap } from '../../parser/post/parsePost';
import { DynamicObject } from '../../types';
import config, { ThemeOpt, theme_dir } from '../../types/_config';
import { helpers } from '../helpers';

interface EJSOption extends ejs.Options, DynamicObject {
  _?: typeof helpers;
  page?: Partial<postMap>;
  config?: typeof config;
  theme?: ThemeOpt;
}

export function EJSRenderFile(file: string, opts: EJSOption = {}) {
  //opts._ = helpers;
  opts.root = join(theme_dir, 'layout/layout.ejs');
  opts = Object.assign(helpers, opts);
  return ejs.renderFile(file, opts);
}

export function EJSRenderString(content: string, opts: EJSOption = {}) {
  opts.root = join(theme_dir, 'layout/layout.ejs');
  opts = Object.assign(helpers, opts);
  const render = ejs.render(content, opts);
  //if (opts.async) return Promise.resolve(render);
  return render;
}

const ejs_object = {
  ejs,
  ...helpers,
  renderFile: EJSRenderFile,
  resolveInclude: ejs.resolveInclude,
  compile: ejs.compile,
  render: EJSRenderString,
  clearCache: ejs.clearCache,
  escapeXML: ejs.escapeXML,
  VERSION: ejs.VERSION,
  name: ejs.name,
  cache: ejs.cache,
  fileLoader: ejs.fileLoader,
  localsName: ejs.localsName,
  openDelimiter: ejs.openDelimiter,
  closeDelimiter: ejs.closeDelimiter,
  delimiter: ejs.delimiter,
  promiseImpl: ejs.promiseImpl,
  Template: ejs.Template
};

export default ejs_object;
export { helpers };
