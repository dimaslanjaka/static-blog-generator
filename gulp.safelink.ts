import { readdirSync, statSync } from 'fs';
import gulp from 'gulp';
import dom from 'gulp-dom/src';
import { join } from 'path';
import sf from 'safelinkify';
import { getConfig } from 'static-blog-generator';
import { TaskCallback } from 'undertaker';
import { deployConfig } from './deploy';

const config = getConfig();
const { deployDir } = deployConfig();
const configSafelink = Object.assign(
  { enable: false },
  config.external_link.safelink
);
const safelink = new sf.safelink({
  redirect: [config.external_link.safelink.redirect],
  password: config.external_link.safelink.password,
  type: config.external_link.safelink.type
});
const internal_links = [
  ...config.external_link.exclude,
  new URL(config.url).host,
  'www.webmanajemen.com',
  'https://github.com/dimaslanjaka',
  '/dimaslanjaka1',
  'dimaslanjaka.github.io'
];

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
          '**/chimeraland/monsters/**/*',
          '**/chimeraland/attendants/**/*',
          '**/chimeraland/recipes/**/*',
          '**/chimeraland/materials/**/*',
          '**/chimeraland/scenic-spots/**/*'
        ]
      })
      .pipe(
        dom(function (filePath) {
          //https://github.com/trygve-lie/gulp-dom
          //this.querySelectorAll('body')[0].setAttribute('data-version', '1.0');
          const elements = Array.from(this.querySelectorAll('a'));
          if (configSafelink.enable) {
            for (let i = 0; i < elements.length; i++) {
              const a = elements[i];
              const href = String(a['href']).trim();
              if (new RegExp('^https?://').test(href)) {
                if (isValidHttpUrl(href)) {
                  /**
                   * match host
                   */
                  const matchHost = internal_links.includes(new URL(href).host);
                  /**
                   * match url
                   */
                  const matchHref = internal_links.includes(href);
                  if (!matchHref) {
                    a.setAttribute('rel', 'nofollow noopener noreferer');
                  }
                  if (!matchHost && !matchHref) {
                    const safelinkPath = safelink.encodeURL(href);
                    if (
                      typeof safelinkPath == 'string' &&
                      safelinkPath.length > 0
                    ) {
                      a.setAttribute('href', safelinkPath);
                    }
                  }
                } else {
                  console.log('invalid url', href, filePath);
                }
              }
            }
          }
        })
      )
      .pipe(gulp.dest(cwd))
      .once('end', () => resolve(null));
  });
}

function isValidHttpUrl(string: string | URL) {
  let url: URL;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === 'http:' || url.protocol === 'https:';
}
