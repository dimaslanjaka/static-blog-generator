'use strict';

var ansiColors = require('ansi-colors');
var fs = require('fs-extra');
var gulp = require('gulp');
var sf = require('safelinkify');
var sbgUtils = require('sbg-utility');
var through2 = require('through2');
var path = require('upath');

/**
 * Process Safelink on Deploy Dir
 * @param _done callback function
 * @param cwd working directory to scan html's
 * @returns
 */
function taskSafelink(_done, cwd) {
    const config = sbgUtils.getConfig();
    const workingDir = typeof cwd === 'string' ? cwd : config.deploy.deployDir;
    const logname = ansiColors.greenBright('safelink');
    // skip process safelink
    let hasError = false;
    if (!config.external_link.safelink) {
        hasError = true;
        sbgUtils.Logger.log(logname, 'config safelink', ansiColors.red('not configured'));
    }
    if (!config.external_link.safelink.redirect) {
        hasError = true;
        sbgUtils.Logger.log(logname, 'safelink redirector', ansiColors.red('not configured'));
    }
    if (!config.external_link.safelink.enable) {
        hasError = true;
        sbgUtils.Logger.log(logname, ansiColors.red('disabled'));
    }
    if (fs.existsSync(workingDir) && !hasError) {
        const defaultConfigSafelink = {
            enable: false,
            exclude: [],
            redirect: 'https://www.webmanajemen.com/page/safelink.html?url=',
            password: 'root',
            type: 'base64'
        };
        const configSafelink = Object.assign(defaultConfigSafelink, config.external_link.safelink || {});
        let baseURL = '';
        try {
            baseURL = new URL(config.url).host;
        }
        catch {
            //
        }
        const opt = {
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
        const gulpopt = {
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
            });
            gulpopt.ignore?.concat(...ignore);
        }
        return gulp
            .src(['**/*.{html,htm}'], gulpopt)
            .pipe(sbgUtils.gulpCached({ name: 'safelink' }))
            .pipe(through2.obj(async (file, _enc, next) => {
            // drops
            if (file.isNull() || file.isDirectory() || !file || file.isStream())
                return next();
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
            sbgUtils.Logger.log('cannot parse', file.path);
            // drop fails
            next();
        }))
            .pipe(gulp.dest(workingDir));
    }
    else {
        const wstream = sbgUtils.createWriteStream(path.join(config.cwd, 'tmp/errors/safelink.log'));
        return wstream;
    }
}

exports.taskSafelink = taskSafelink;
