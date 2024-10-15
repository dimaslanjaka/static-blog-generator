import Bluebird from 'bluebird';
import Hexo from 'hexo';
import hexoPostParser__default from 'hexo-post-parser';
import { setConfig, getConfig, chain, normalizePath, fetchConfig, debug, scheduler, noop } from 'sbg-utility';
import path from 'upath';
import cleanArchive from './clean/cleanArchive.mjs';
import { cleanDb } from './clean/cleanDb.mjs';
import { cleanGeneratedPosts } from './clean/cleanGeneratedPosts.mjs';
import { deployCopy } from './deploy/copy.mjs';
import { taskSafelink } from './gulp.safelink.mjs';
import { taskSeo } from './gulp.seo.mjs';
import { copyAllPosts } from './post/copy.mjs';
import { findBrokenImagesGlob } from './post/find-broken-images.mjs';
import standaloneRunner from './post/standalone.mjs';

class SBG {
    /**
     * Static blog generator
     * @param cwd base folder
     */
    constructor(cwd, options) {
        this.setConfig = setConfig;
        this.getConfig = getConfig;
        /**
         * run files ends with `standalone.js` inside source posts {@link standaloneRunner}
         * @returns
         */
        this.standalone = () => chain([{ callback: standaloneRunner }]);
        this.deploy = new (class {
            constructor(superThis) {
                this.superThis = superThis;
                this.copy = deployCopy;
                //
            }
        })(this);
        if (!cwd)
            cwd = normalizePath(process.cwd());
        // fetch config
        fetchConfig(cwd);
        // apply config
        this.config = getConfig();
        // modify config
        this.cwd = cwd;
        this.config.cwd = cwd;
        options = Object.assign(this.config, options || {}, { cwd });
        debug('sbg-api')('cwd', cwd);
        // re-apply config
        this.config = setConfig(options);
        // apply config hexo-post-parser
        hexoPostParser__default.setConfig(this.config);
        SBG.setApi(this);
        new scheduler();
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
        setConfig(this.config);
        // recall index
        return await import('./index.mjs');
    }
    /**
     * Auto seo on public dir (_config_yml.public_dir) (run after generated)
     * @param customPath run seo fixer on spesific folder
     * @returns
     */
    seo(customPath) {
        return new Bluebird((resolve) => {
            taskSeo(null, customPath || path.join(this.cwd, this.config.public_dir)).once('end', function () {
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
        return copyAllPosts(config);
    }
    /**
     * Anonymize external links on public dir (_config_yml.public_dir) (run after generated)
     * @param customPath run anonymizer external links on spesific folder
     * @returns
     */
    safelink(customPath) {
        return new Bluebird((resolve) => {
            taskSafelink(null, customPath || path.join(this.cwd, this.config.public_dir)).once('end', function () {
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
        await hexo.init().catch(noop);
        await hexo.load().catch(noop);
        // hexo generate
        await hexo.call('generate').catch(noop);
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
            await cleanDb().catch(console.log);
            await cleanArchive().catch(console.log);
        }
        else if (opt === 'archive') {
            await cleanArchive().catch(console.log);
        }
        else if (opt === 'post') {
            debug('clean')('generated posts');
            await cleanGeneratedPosts().catch(console.log);
        }
        else {
            await cleanDb().catch(console.log);
        }
    }
    async findBrokenImages() {
        return findBrokenImagesGlob(this.config);
    }
}

export { SBG, SBG as default };
