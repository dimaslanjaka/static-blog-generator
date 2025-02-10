import Bluebird from 'bluebird';
import Hexo from 'hexo';
import * as postParser from 'hexo-post-parser';
import { ProjConf, chain, debug, fetchConfig, getConfig, noop, normalizePath, scheduler, setConfig } from 'sbg-utility';
import path from 'upath';
import * as cleaner from './clean';
import { deployCopy } from './deploy/copy';
import { taskSafelink } from './gulp.safelink';
import { taskSeo } from './gulp.seo';
import * as pcopy from './post/copy';
import { findBrokenImagesGlob } from './post/find-broken-images';
import standaloneRunner from './post/standalone';

class SBG {
  cwd: string;
  config: ProjConf;
  setConfig = setConfig;
  getConfig = getConfig;

  /**
   * Static blog generator
   * @param cwd base folder
   */
  constructor(cwd?: postParser.Nullable<string>, options?: Parameters<typeof setConfig>[0]) {
    if (!cwd) cwd = normalizePath(process.cwd());
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
    postParser.setConfig(this.config);
    SBG.setApi(this);
    new scheduler();
  }

  static currentApI: SBG;
  static setApi(api: SBG) {
    this.currentApI = api;
  }
  static getApi() {
    return this.currentApI;
  }

  // /**
  //  * get index packages
  //  * @returns
  //  */
  // async core() {
  //   // apply current config
  //   setConfig(this.config);
  //   // recall index
  //   return await import('./index');
  // }

  /**
   * run files ends with `standalone.js` inside source posts {@link standaloneRunner}
   * @returns
   */
  // standalone = () => chain([{ callback: standaloneRunner }]);
  standalone() {
    return standaloneRunner(this.config);
  }

  /**
   * Auto seo on public dir (_config_yml.public_dir) (run after generated)
   * @param customPath run seo fixer on spesific folder
   * @returns
   */
  seo(customPath?: string | null | undefined) {
    return new Bluebird((resolve) => {
      taskSeo(null, customPath || path.join(this.cwd, this.config.public_dir)).once('end', function () {
        setTimeout(() => {
          resolve();
        }, 3000);
      });
    });
  }

  copyStream = () => chain([{ callback: () => pcopy.streamCopy(undefined, this.config) }]);
  async copyAsync() {
    await pcopy.promiseCopy(this.config);
    await pcopy.promiseCopyAssets(this.config);
  }

  /**
   * Copy all **src-post** to **source/_posts** (run before generate)
   * * see the method {@link pcopy.promiseCopy}
   * @param mode choice `stream` or `async`
   * @returns
   */
  copy(mode: 'stream' | 'async' = 'stream') {
    if (mode === 'stream') return this.copyStream();
    return this.copyAsync();
  }

  /**
   * Anonymize external links on public dir (_config_yml.public_dir) (run after generated)
   * @param customPath run anonymizer external links on spesific folder
   * @returns
   */
  safelink(customPath?: string | null | undefined) {
    return new Bluebird((resolve) => {
      const task = taskSafelink(null, customPath || path.join(this.cwd, this.config.public_dir));
      task.once('end', function () {
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
  async clean(opt?: 'all' | 'archive' | 'database' | 'post') {
    if (opt === 'all') {
      await cleaner.cleanDb().catch(console.log);
      await cleaner.cleanArchive().catch(console.log);
    } else if (opt === 'archive') {
      await cleaner.cleanArchive().catch(console.log);
    } else if (opt === 'post') {
      debug('clean')('generated posts');
      await cleaner.cleanGeneratedPosts().catch(console.log);
    } else {
      await cleaner.cleanDb().catch(console.log);
    }
  }

  async findBrokenImages() {
    return findBrokenImagesGlob(this.config);
  }

  public deploy = new (class {
    config: ProjConf;
    cwd: string;

    constructor(public superThis: SBG) {
      this.config = superThis.config;
      this.cwd = superThis.cwd;
    }

    copy() {
      deployCopy({ config: this.config, cwd: this.cwd });
    }
  })(this);
}

export default SBG;
export { SBG as Application };
