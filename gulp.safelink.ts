import { readdirSync, statSync } from 'fs';
import gulp from 'gulp';
import { join } from 'path';
import sf from 'safelinkify';
import { getConfig } from 'static-blog-generator';
import through2 from 'through2';
import { TaskCallback } from 'undertaker';
import { deployConfig } from './deploy';

const config = getConfig();
const { deployDir } = deployConfig();
const configSafelink = Object.assign(
  { enable: false },
  config.external_link.safelink
);
const safelink = new sf.safelink({
  // exclude patterns (dont anonymize these patterns)
  exclude: [
    ...config.external_link.exclude,
    /https?:\/\/?(?:([^*]+)\.)?webmanajemen\.com/,
    /([a-z0-9](?:[a-z0-9-]{1,61}[a-z0-9])?[.])*webmanajemen\.com/,
    new URL(config.url).host,
    'www.webmanajemen.com',
    'https://github.com/dimaslanjaka',
    'https://facebook.com/dimaslanjaka1',
    'dimaslanjaka.github.io',
    ...configSafelink.exclude
  ],
  redirect: [config.external_link.safelink.redirect, configSafelink.redirect],
  password: configSafelink.password || config.external_link.safelink.password,
  type: configSafelink.type || config.external_link.safelink.type
});

// safelinkify the deploy folder
gulp.task('safelink', iterate);

export function iterate(_done?: TaskCallback) {
  const paths = readdirSync(deployDir)
    .map((path) => join(deployDir, path))
    .filter((path) => statSync(path).isDirectory())
    .map((path) => safelinkProcess(null, path));
  return Promise.all(paths);
}

export function safelinkProcess(_done?: TaskCallback, cwd = deployDir) {
  return new Promise((resolve) => {
    cwd = cwd || deployDir;
    gulp
      .src(['**/*.{html,htm}'], {
        cwd,
        ignore: [
          // skip react project
          '**/chimeraland/{monsters,attendants,recipes,materials,scenic-spots}/**/*.html',
          // skip tools
          '**/embed.html',
          '**/tools.html',
          '**/safelink.html'
        ]
      })
      .pipe(
        through2.obj(async (file, _enc, next) => {
          // drop null
          if (file.isNull()) return next();
          // do safelinkify
          const content = String(file.contents);
          const parsed = await safelink.parse(content);
          if (parsed) {
            file.contents = Buffer.from(parsed);
            return next(null, file);
          }
          console.log('cannot parse', file.path);
          next();
        })
      )
      .pipe(gulp.dest(cwd))
      .once('end', () => resolve(null));
  });
}
