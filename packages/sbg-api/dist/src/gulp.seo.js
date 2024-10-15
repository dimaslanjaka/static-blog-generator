'use strict';

var ansiColors = require('ansi-colors');
var gulp = require('gulp');
var sbgUtils = require('sbg-utility');

/**
 * Auto seo runner
 * @param cwd working directory to scan html's
 */
function taskSeo(_done, cwd) {
    const config = sbgUtils.getConfig();
    const ignore = Array.isArray(config.exclude) ? config.exclude : [];
    ignore.push(...sbgUtils.commonIgnore);
    return gulp
        .src(['**/*.{htm,html}', '*.{html,htm}'], { cwd, ignore })
        .pipe(sbgUtils.gulpCached({ name: 'seo' }))
        .pipe(sbgUtils.gulpDom(function (path) {
        // fix alt images
        const images = Array.from(this.querySelectorAll('img[src]'));
        images.forEach((el) => {
            const alt = el.getAttribute('alt');
            if (!alt || alt.length === 0) {
                const title = this.title + ' - ' + el.getAttribute('src') || 'No Alt';
                el.setAttribute('alt', title);
            }
        });
        // fix title iframe
        const iframes = Array.from(this.querySelectorAll('iframe[src]'));
        iframes.forEach((el) => {
            const alt = el.getAttribute('title');
            if (!alt || alt.length === 0) {
                const title = this.title + ' - ' + el.getAttribute('src') || 'No Title';
                el.setAttribute('title', title);
            }
        });
        // WARNING MAKER
        // count H1
        const h1 = this.querySelectorAll('h1');
        if (h1.length > 1) {
            sbgUtils.Logger.log(ansiColors.yellowBright('[WARN]'), `H1 (${h1.length}) ${path}`);
        }
    }))
        .pipe(gulp.dest(cwd));
}

exports.taskSeo = taskSeo;
