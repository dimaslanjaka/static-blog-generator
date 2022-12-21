import { existsSync } from 'fs';
import gulp from 'gulp';
import sf, { SafelinkOptions } from 'safelinkify';
import through2 from 'through2';
import { SrcOptions } from 'vinyl-fs';
import { getConfig } from './gulp.config';

/**
 * Process Safelink on Deploy Dir
 * @param _done callback function
 * @param cwd run on folder
 * @returns
 */
export function safelinkProcess(_done?: gulp.TaskFunctionCallback, cwd?: undefined | null | string) {
  return new Promise((resolve) => {
    const config = getConfig();
    // skip process safelink
    if (!config.external_link.safelink) return resolve(new Error('config safelink not configured'));
    if (!config.external_link.safelink.redirect) return resolve(new Error('safelink redirector not configured'));

    const configSafelink = Object.assign({ enable: false }, config.external_link.safelink || {});
    let baseURL = '';
    try {
      baseURL = new URL(config.url).host;
    } catch {
      //
    }

    const opt: Partial<SafelinkOptions> = {
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
      redirect: [],
      //redirect: [, configSafelink.redirect],
      password: configSafelink.password || config.external_link.safelink.password,
      type: configSafelink.type || config.external_link.safelink.type
    };

    if (configSafelink.redirect) {
      opt.redirect = configSafelink.redirect;
    }

    const safelink = new sf.safelink(opt);

    const folder = cwd || config.deploy.deployDir;
    const gulpopt: SrcOptions = {
      cwd: folder,
      ignore: []
    };

    if (Array.isArray(config.external_link.exclude)) {
      gulpopt.ignore?.concat(...config.external_link.exclude);
    }
    if (Array.isArray(configSafelink.exclude)) {
      const ignore = configSafelink.exclude.filter((str) => {
        if (typeof str === 'string') {
          return !/^(https?:\/|www.)/.test(str);
        }
        return false;
      }) as string[];
      gulpopt.ignore?.concat(...ignore);
    }
    if (existsSync(folder)) {
      return gulp
        .src(['**/*.{html,htm}'], gulpopt)
        .pipe(
          through2.obj(async (file, _enc, next) => {
            // drop null
            if (file.isNull() || file.isDirectory() || !file) return next();
            if (file.isBuffer() && Buffer.isBuffer(file.contents)) {
              // do safelinkify
              const content = file.contents.toString('utf-8');
              const parsed = await safelink.parse(content);
              if (typeof parsed === 'string') {
                // console.log(parsed);
                file.contents = Buffer.from(parsed);
                return next(null, file);
              }
            }
            console.log('cannot parse', file.path);
            // drop fails
            next();
          })
        )
        .pipe(gulp.dest(config.deploy.deployDir))
        .once('end', () => resolve(null));
    }
    return resolve(null);
  });
}

// safelinkify the deploy folder
gulp.task('safelink', safelinkProcess);
