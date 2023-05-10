import ansiColors from 'ansi-colors';
import { existsSync } from 'fs';
import gulp from 'gulp';
import path from 'path';
import sf, { SafelinkOptions } from 'safelinkify';
import { createWriteStream, getConfig, gulpCached, Logger } from 'sbg-utility';
import through2 from 'through2';
import { gulpOpt } from './gulp-options';

/**
 * Process Safelink on Deploy Dir
 * @param _done callback function
 * @param cwd working directory to scan html's
 * @returns
 */
export function taskSafelink(_done?: gulp.TaskFunctionCallback | null | undefined, cwd?: undefined | null | string) {
  const config = getConfig();
  const workingDir = typeof cwd === 'string' ? cwd : config.deploy.deployDir;
  const logname = ansiColors.greenBright('safelink');

  // skip process safelink
  let hasError = false;
  if (!config.external_link.safelink) {
    hasError = true;
    Logger.log(logname, 'config safelink', ansiColors.red('not configured'));
  }
  if (!config.external_link.safelink.redirect) {
    hasError = true;
    Logger.log(logname, 'safelink redirector', ansiColors.red('not configured'));
  }
  if (!config.external_link.safelink.enable) {
    hasError = true;
    Logger.log(logname, ansiColors.red('disabled'));
  }

  if (existsSync(workingDir) && !hasError) {
    const defaultConfigSafelink: SafelinkOptions & Record<string, any> = {
      enable: false,
      exclude: [] as string[],
      redirect: 'https://www.webmanajemen.com/page/safelink.html?url=',
      password: 'root',
      type: 'base64'
    };
    const configSafelink = Object.assign(defaultConfigSafelink, config.external_link.safelink || {});
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

    const gulpopt: gulpOpt = {
      cwd: workingDir,
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

    return gulp
      .src(['**/*.{html,htm}'], gulpopt)
      .pipe(gulpCached({ name: 'safelink' }))
      .pipe(
        through2.obj(async (file, _enc, next) => {
          // drops
          if (file.isNull() || file.isDirectory() || !file || file.isStream()) return next();
          // process
          if (file.isBuffer() && Buffer.isBuffer(file.contents)) {
            // do safelinkify
            const content = file.contents.toString('utf-8');
            const parsed = await safelink.parse(content);
            if (typeof parsed === 'string') {
              // Logger.log(parsed);
              file.contents = Buffer.from(parsed);
              return next(null, file);
            }
          }
          Logger.log('cannot parse', file.path);
          // drop fails
          next();
        })
      )
      .pipe(gulp.dest(workingDir));
  } else {
    const wstream = createWriteStream(path.join(config.cwd, 'tmp/errors/safelink.log'));
    return wstream;
  }
}

// safelinkify the deploy folder
gulp.task('safelink', taskSafelink);
