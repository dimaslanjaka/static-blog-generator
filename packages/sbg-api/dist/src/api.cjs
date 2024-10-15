'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Bluebird = require('bluebird');
var Hexo = require('hexo');
var hexoPostParser = require('hexo-post-parser');
var sbgUtils = require('sbg-utility');
var path = require('upath');
var cleanArchive = require('./clean/cleanArchive.cjs');
var cleanDb = require('./clean/cleanDb.cjs');
var cleanGeneratedPosts = require('./clean/cleanGeneratedPosts.cjs');
var copy = require('./deploy/copy.cjs');
var gulp_safelink = require('./gulp.safelink.cjs');
var gulp_seo = require('./gulp.seo.cjs');
var copy$1 = require('./post/copy.cjs');
var findBrokenImages = require('./post/find-broken-images.cjs');
var standalone = require('./post/standalone.cjs');

class SBG {
    /**
     * Static blog generator
     * @param cwd base folder
     */
    constructor(cwd, options) {
        this.setConfig = sbgUtils.setConfig;
        this.getConfig = sbgUtils.getConfig;
        /**
         * run files ends with `standalone.js` inside source posts {@link standaloneRunner}
         * @returns
         */
        this.standalone = () => sbgUtils.chain([{ callback: standalone.default }]);
        this.deploy = new (class {
            constructor(superThis) {
                this.superThis = superThis;
                this.copy = copy.deployCopy;
                //
            }
        })(this);
        if (!cwd)
            cwd = sbgUtils.normalizePath(process.cwd());
        // fetch config
        sbgUtils.fetchConfig(cwd);
        // apply config
        this.config = sbgUtils.getConfig();
        // modify config
        this.cwd = cwd;
        this.config.cwd = cwd;
        options = Object.assign(this.config, options || {}, { cwd });
        sbgUtils.debug('sbg-api')('cwd', cwd);
        // re-apply config
        this.config = sbgUtils.setConfig(options);
        // apply config hexo-post-parser
        hexoPostParser.setConfig(this.config);
        SBG.setApi(this);
        new sbgUtils.scheduler();
    }
    static setApi(api) {
        this.currentApI = api;
    }
    static getApi() {
        return this.currentApI;
    }
    /**
     * get index packages
     * @returns
     */
    async core() {
        // apply current config
        sbgUtils.setConfig(this.config);
        // recall index
        return await Promise.resolve().then(function () { return require('./index.cjs'); });
    }
    /**
     * Auto seo on public dir (_config_yml.public_dir) (run after generated)
     * @param customPath run seo fixer on spesific folder
     * @returns
     */
    seo(customPath) {
        return new Bluebird((resolve) => {
            gulp_seo.taskSeo(null, customPath || path.join(this.cwd, this.config.public_dir)).once('end', function () {
                setTimeout(() => {
                    resolve();
                }, 3000);
            });
        });
    }
    /**
     * Copy all **src-post** to **source/_posts** (run before generate)
     * * see the method {@link pcopy.copyAllPosts}
     * @returns
     */
    // copy = () => chain([{ callback: () => pcopy.copyAllPosts(undefined, this.config) }]);
    copy() {
        const config = this.config;
        // return new Promise(function (resolve: (args: any) => any) {
        //   // const streamer = pcopy.copyAllPosts(undefined, config);
        //   // streamer.on('end', function () {
        //   //   // wait all handler to be closed
        //   //   setTimeout(() => resolve(null), 7000);
        //   // });
        // });
        return copy$1.copyAllPosts(config);
    }
    /**
     * Anonymize external links on public dir (_config_yml.public_dir) (run after generated)
     * @param customPath run anonymizer external links on spesific folder
     * @returns
     */
    safelink(customPath) {
        return new Bluebird((resolve) => {
            gulp_safelink.taskSafelink(null, customPath || path.join(this.cwd, this.config.public_dir)).once('end', function () {
                setTimeout(() => {
                    resolve();
                }, 3000);
            });
        });
    }
    /**
     * generate site with hexo
     */
    async generate() {
        const hexo = new Hexo(this.cwd);
        // hexo init
        await hexo.init().catch(sbgUtils.noop);
        await hexo.load().catch(sbgUtils.noop);
        // hexo generate
        await hexo.call('generate').catch(sbgUtils.noop);
        await hexo.exit(new Error());
    }
    /**
     * clean cache, auto generated posts, etc
     * @see {@link cleaner.cleanDb}
     * @see {@link cleaner.cleanArchive}
     * @see {@link cleaner.cleanGeneratedPosts}
     */
    async clean(opt) {
        if (opt === 'all') {
            await cleanDb.cleanDb().catch(console.log);
            await cleanArchive.default().catch(console.log);
        }
        else if (opt === 'archive') {
            await cleanArchive.default().catch(console.log);
        }
        else if (opt === 'post') {
            sbgUtils.debug('clean')('generated posts');
            await cleanGeneratedPosts.cleanGeneratedPosts().catch(console.log);
        }
        else {
            await cleanDb.cleanDb().catch(console.log);
        }
    }
    async findBrokenImages() {
        return findBrokenImages.findBrokenImagesGlob(this.config);
    }
}

exports.SBG = SBG;
exports.default = SBG;
