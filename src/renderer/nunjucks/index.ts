import nunjucks from 'nunjucks';
import { join } from 'path';
import { inspect } from 'util';
import { write } from '../../node/filemanager';
import config, { theme_config } from '../../types/_config';
import { rendererHelpers } from '../helpers';

const env = nunjucks.configure({
  autoescape: true,
  noCache: !config.generator.cache
});
delete rendererHelpers.root;
delete rendererHelpers.layout;
Object.keys(rendererHelpers).forEach((key) => {
  if (typeof rendererHelpers[key] === 'function') {
    env.addFilter(key, rendererHelpers[key]);
    delete rendererHelpers[key];
  }
});
// register custom helper
// https://mozilla.github.io/nunjucks/api.html#custom-filters
env.addFilter('shorten', function (str, count) {
  if (str) return str.slice(0, count || 5);
  return str;
});

export default function nunjucksRenderer(
  str: string,
  data: Record<string, any> = {}
) {
  return new Promise((resolve, reject) => {
    data = Object.assign(
      {},
      rendererHelpers,
      config,
      { theme: theme_config },
      data
    );
    write(join(__dirname, 'tmp/data.log'), inspect(data));
    nunjucks.renderString(str, data, function (err, output) {
      // If there's an error during rendering, early return w/o further processing
      if (err) {
        return reject(err);
      }

      // The render fn calls the passed-in fn with output as a string
      // You can do whatever you'd like with that string here
      resolve(output);
    });
  });
}
