import gulp from 'gulp';
import sf from 'safelinkify';
import through2 from 'through2';

import ProjectConfig, { deployDir } from './gulp.config';

const config = ProjectConfig;

const configSafelink = Object.assign({ enable: false }, config.external_link?.safelink || {});
let baseURL = '';
try {
  baseURL = new URL(config.url).host;
} catch {
  //
}
const safelink = new sf.safelink({
  // exclude patterns (dont anonymize these patterns)
  exclude: [
    ...(config.external_link?.exclude || []),
    /https?:\/\/?(?:([^*]+)\.)?webmanajemen\.com/,
    /([a-z0-9](?:[a-z0-9-]{1,61}[a-z0-9])?[.])*webmanajemen\.com/,
    baseURL,
    'www.webmanajemen.com',
    'https://github.com/dimaslanjaka',
    'https://facebook.com/dimaslanjaka1',
    'dimaslanjaka.github.io',
    ...configSafelink.exclude
  ].filter(function (x, i, a) {
    // remove duplicate and empties
    return a.indexOf(x) === i && x.toString().trim().length !== 0;
  }),
  redirect: [config.external_link.safelink.redirect, configSafelink.redirect],
  password: configSafelink.password || config.external_link.safelink.password,
  type: configSafelink.type || config.external_link.safelink.type
});

export function safelinkProcess(_done?: gulp.TaskFunctionCallback) {
  return new Promise((resolve) => {
    gulp
      .src(['**/*.{html,htm}'], {
        cwd: deployDir,
        ignore: [
          // skip react project
          //'**/chimeraland/{monsters,attendants,recipes,materials,scenic-spots}/**/*.html',
          '**/chimeraland/recipes.html',
          // skip tools
          '**/embed.html',
          '**/tools.html',
          '**/safelink.html',
          // package registry
          '**/node_modules/**',
          '**/vendor/**'
        ]
      })
      .pipe(
        through2.obj(async (file, _enc, next) => {
          // drop null
          if (file.isNull() || file.isDirectory() || !file) return next();
          if (file.isBuffer()) {
            // do safelinkify
            const content = file.contents.toString('utf-8');
            const parsed = await safelink.parse(content);
            if (parsed) {
              file.contents = Buffer.from(parsed);
              return next(null, file);
            }
          }
          console.log('cannot parse', file.path);
          // drop fails
          next();
        })
      )
      .pipe(gulp.dest(deployDir))
      .once('end', () => resolve(null));
  });
}

// safelinkify the deploy folder
gulp.task('safelink', safelinkProcess);
