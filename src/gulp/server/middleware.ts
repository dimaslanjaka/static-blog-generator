import Bluebird from 'bluebird';
import chalk from 'chalk';
import compress from 'compression';
import spawn from 'cross-spawn';
import { deepmerge } from 'deepmerge-ts';
import { existsSync, readFileSync } from 'fs';
import gulp, { TaskFunction } from 'gulp';
import memoizee from 'memoizee';
import { join, toUnix } from 'upath';
import urlParser from '../../curl/url-parser';
import { generateDummyPosts } from '../../dummy/auto-post';
import { array_unique, removeEmpties } from '../../node/array-utils';
import color from '../../node/color';
import { write } from '../../node/filemanager';
import jdom from '../../node/jsdom';
import { isMatch, replaceArr } from '../../node/string-utils';
import parsePost from '../../parser/post/parsePost';
import ejs_object from '../../renderer/ejs';
import { EJSRenderer } from '../../renderer/ejs/EJSRenderer';
import { get_source_hash, get_src_posts_hash } from '../../types/folder-hashes';
import config, { post_generated_dir } from '../../types/_config';
import '../tasks/generate';
import fixHtmlPost from '../tasks/generate-after';
import { generateIndex } from '../tasks/generate/archives';
import './gen-middleware';

let gulpIndicator = false;
const cwd = memoizee(() => toUnix(process.cwd()));
const homepage = new URL(config.url);
let preview: string;
// @todo setup route data tag and category
let routedata = {
  category: [] as string[],
  tag: [] as string[]
};
let labelSrc: string[] = [];
const dom = new jdom();
function showPreview(str: string | Buffer) {
  const previewfile = join(__dirname, 'public/preview.html');
  if (!preview)
    preview = existsSync(previewfile)
      ? readFileSync(previewfile, 'utf-8')
      : 'NO PREVIEW AVAILABLE';
  const doc = dom.parse(String(str));
  doc.body.innerHTML += preview;
  Array.from(doc.querySelectorAll('a')).forEach((a) => {
    let href = a.getAttribute('href');
    if (
      typeof href == 'string' &&
      isMatch(href, new RegExp('^https?://' + homepage.host))
    ) {
      href = href.replace(new RegExp('^https?://' + homepage.host + '/'), '/');
      return a.setAttribute('href', href);
    }
    a.setAttribute('href', href);
  });
  const body = dom.serialize();
  //body = body.replace(new RegExp(config.url + '/', 'gm'), '/').replace(new RegExp(config.url, 'gm'), '');

  dom.close();
  return body;
}
/** source and src-posts hashes modified indicator */
let hashes = '';
export const middlewareCopyAssets = (...fn: TaskFunction[] | string[]) => {
  return new Bluebird((resolve) => {
    if (!gulpIndicator) {
      gulpIndicator = true;
      const tasks = ['generate:assets', 'generate:template', ...fn].filter(
        (s) => s && (typeof s === 'string' || typeof s === 'function')
      );
      Bluebird.all([get_src_posts_hash(), get_source_hash()]).spread(
        (src_posts, source) => {
          // @todo [server] prevent call copy without any modifications
          const chashes = `${src_posts}:${source}`;
          if (chashes !== hashes) {
            hashes = `${src_posts}:${source}`;
            gulp.series(...tasks)(() => {
              gulpIndicator = false;
              if (existsSync(join(cwd(), config.public_dir, 'package.json'))) {
                spawn(
                  'yarn',
                  ['install', '--check-files', '--production=true'],
                  {
                    cwd: join(cwd(), config.public_dir),
                    shell: true,
                    stdio: 'inherit'
                  }
                );
              }

              // resolve
              resolve();
            });
          }
        }
      );
    }
  });
};

const ServerMiddleWare: import('browser-sync').Options['middleware'] = [
  function (_, res, next) {
    middlewareCopyAssets(); // dont await to keep performance
    // custom headers
    res.setHeader('X-Powered-By', 'Static Blog Generator'); // send X-Powered-By
    if (!config.server.cache) {
      res.setHeader('Expires', 'on, 01 Jan 1970 00:00:00 GMT');
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
      res.setHeader('Cache-Control', 'post-check=0, pre-check=0');
      res.setHeader('Pragma', 'no-cache');
    }
    next();
  },
  // category and tag route
  async function (req, res, next) {
    // @todo generate route tag and category
    // setup variable tag and category
    const routeFile = join(__dirname, 'routes.json');
    routedata = deepmerge(
      routedata,
      JSON.parse(readFileSync(routeFile).toString())
    );
    labelSrc = array_unique(routedata.category.concat(routedata.tag));
    const pathname: string = req['_parsedUrl'].pathname;
    const filterPathname = pathname.replace(/\/+/, '/').replace(/^\//, '');
    const split = removeEmpties(filterPathname.split('/')).map((str) =>
      str.trim()
    );
    const labelname = split[1];
    const pagenum = split.length > 3 ? parseInt(split[3]) : null;

    // process tag and category
    if (split.includes(config.tag_dir) || split.includes(config.category_dir))
      for (let i = 0; i < labelSrc.length; i++) {
        const path = labelSrc[i];
        //console.log(pathname.includes(path), pathname, path);

        if (pathname.includes(path)) {
          //console.log(path, pathname);
          /*const generatedTo = join(
            cwd(),
            config.public_dir,
            decodeURIComponent(filterPathname),
            'index.html'
          );*/
          //console.log('[generate][label]', replace_pathname, labelname, generatedTo);
          console.log(
            `${color['Violet Red']('[generate][label]')} ${labelname} ${
              pagenum || 'null'
            }`
          );

          /*if (labelname && typeof labelname == 'string') {
            const result =
              (await generateTags(labelname, pagenum)) ||
              (await generateCategories(labelname, pagenum));
            writeFileSync(generatedTo, result);
            if (result) {
              return res.end(showPreview(result));
            }
          }*/
        }
      }
    return next();
  },
  // content route
  async function (req, res, next) {
    const url = new urlParser(config.url + req.url).result;
    const isHomepage = req.url === '/';
    const isArchives = req.url.startsWith('/archives/');
    const pathname: string = req['_parsedUrl'].pathname; // just get pathname

    // @todo render homepage and archives
    if (isHomepage || isArchives) {
      const logname = isHomepage
        ? color.green('[homepage]')
        : color.green('[archive]');
      const indexPage = isArchives ? parseInt(url.filename) : null;
      const sourceIndex = join(cwd(), config.public_dir, 'index.html');
      const str = await generateIndex(
        isHomepage ? 'homepage' : indexPage ? indexPage : null
      );
      if (str) {
        console.log(logname, 'pre-processed', req.url, '->', sourceIndex);
        return res.end(showPreview(str));
      }
      if (existsSync(sourceIndex)) {
        console.log(logname, 'processed', req.url, '->', sourceIndex);
        return res.end(showPreview(readFileSync(sourceIndex)));
      }
      return next();
    }

    // @todo skip labels (tag and category)
    if (labelSrc.includes(pathname)) return next();

    if (isMatch(pathname, new RegExp('^/' + config.category_dir + '/')))
      return next();
    if (isMatch(pathname, new RegExp('^/' + config.tag_dir + '/')))
      return next();
    // skip api, admin
    if (isMatch(pathname, /^\/(api|admin)/)) return next();
    // skip assets
    if (isMatch(pathname, /.(css|js|png|svg|jpeg|webp|jpg|ico)$/))
      return next();

    //write(tmp('middleware.log'), inspect(req));
    //console.log(req['_parsedUrl'].pathname, req['_parsedUrl'].search);

    const isPage = isMatch(pathname, /(.html|\/)$/);

    if (isPage) {
      res.setHeader('Content-Type', 'text/html');
      // find post and pages
      let sourceMD = [
        join(cwd(), config.source_dir, '_posts', decodeURIComponent(pathname)),
        join(cwd(), config.source_dir, decodeURIComponent(pathname))
      ].map((s) => {
        return s.replace(/.html$/, '.md');
      });
      // push non-markdown source
      sourceMD.push(
        join(cwd(), config.source_dir, decodeURIComponent(pathname))
      );
      // find from src-posts
      let findSrcPost = join(cwd(), 'src-posts', decodeURIComponent(pathname));
      if (findSrcPost.endsWith('/')) findSrcPost += 'index.md';
      findSrcPost = findSrcPost.replace(/.html$/, '.md');
      sourceMD.push(findSrcPost);
      sourceMD = array_unique(
        sourceMD
          .map((path) => {
            if (path.endsWith('/')) return path + 'index.md';
            return path;
          })
          .filter(existsSync)
      );

      if (sourceMD.length > 0) {
        for (let index = 0; index < sourceMD.length; index++) {
          const file = sourceMD[index];
          const dest = join(
            post_generated_dir,
            replaceArr(
              toUnix(file),
              [cwd(), 'source/', '_posts/', 'src-posts/'],
              ''
            )
          ).replace(/.md$/, '.html');

          // start generating
          if (existsSync(file)) {
            if (file.endsWith('.md')) {
              // parse markdown metadata
              const parsed = await parsePost(file);
              if (!parsed) {
                console.log(chalk.redBright('cannot parse'), file);
                //return next();
                continue;
              }
              //const modify = modifyPost(<any>parsed);
              //console.log(modify.metadata.type);
              // render markdown post
              return EJSRenderer(<any>parsed).then((rendered) => {
                rendered = fixHtmlPost(rendered);
                write(dest, rendered);
                const previewed = showPreview(rendered);

                console.log(
                  chalk.greenBright(`[${parsed.metadata.type}]`),
                  'pre-processed',
                  pathname,
                  '->',
                  file
                );
                res.end(previewed);
              });
            } /*if (minimatch(file, '*.{html,txt,json}'))*/ else {
              if (file.endsWith('.html'))
                return res.end(showPreview(readFileSync(file)));
            }
          }
        }
      }
    }
    // show previous generated
    //if (!pathname) console.log('last processed', pathname);
    next();
  },
  // generate dummy posts
  {
    route: '/gen',
    handle: async (_req, res, _next) => {
      const max = String(_req['_parsedUrl']['query'])
        .replace(/[^0-9]/g, '')
        .trim();
      await generateDummyPosts(parseInt(max) || 5);
      // return res.end(gen);
      if (!res.headersSent) return res.end('post generating on backend');
    }
  },
  {
    route: '/api',
    handle: function (req, res, next) {
      // write source/.guid
      if (req.url.includes('generate'))
        write(join(cwd(), config.source_dir, '.guid'), new Date()).then(() =>
          console.log('gulp generate start')
        );
      // write public_dir/.guid
      if (req.url.includes('copy'))
        write(join(cwd(), 'src-posts/.guid'), new Date()).then(() =>
          console.log('gulp copy start')
        );
      res.writeHead(200, {
        'Content-Type': 'text/plain'
      });
      res.end(
        JSON.stringify(
          new Error(
            'Something went wrong. And we are reporting a custom error message.'
          ),
          null,
          2
        )
      );
      next();
    }
  },
  {
    route: '/admin',
    handle: (req, res, next) => {
      return ejs_object
        .renderFile(join(__dirname, 'public/admin.ejs'))
        .then((rendered) => res.end(rendered))
        .catch(next);
    }
  }
];

if ('server' in config && 'compress' in config.server)
  if (config['server']['compress']) {
    // push compression to first index
    ServerMiddleWare.unshift.apply(compress());
  }

export default ServerMiddleWare;
export { ServerMiddleWare };
