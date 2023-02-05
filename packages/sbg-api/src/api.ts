import Bluebird from 'bluebird';
import Hexo from 'hexo';
import { Nullable } from 'hexo-post-parser';
import { chain, debug, fetchConfig, getConfig, noop, scheduler, setConfig } from 'sbg-utility';
import { join } from 'upath';
import * as cleaner from './clean';
import { deployCopy } from './deploy/copy';
import { taskSafelink } from './gulp.safelink';
import { taskSeo } from './gulp.seo';
import * as pcopy from './post/copy';
import standaloneRunner from './post/standalone';

class SBG {
  cwd: string;
  config = getConfig();
  setConfig = setConfig;
  getConfig = getConfig;

  /**
   * Static blog generator
   * @param cwd base folder
   */
  constructor(cwd: Nullable<string>, options?: Parameters<typeof setConfig>[0]) {
    if (!cwd) cwd = process.cwd();
    fetchConfig(cwd);
    this.cwd = cwd;
    this.config.cwd = cwd;
    options = Object.assign(this.config, options || {}, { cwd });
    debug('sbg-api')('cwd', cwd);

    this.config = setConfig(options);
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

  /**
   * get index packages
   * @returns
   */
  async core() {
    // apply current config
    setConfig(this.config);
    // recall index
    return await import('./index');
  }

  /**
   * run files ends with `standalone.js` inside source posts {@link standaloneRunner}
   * @returns
   */
  standalone = () => chain([{ callback: standaloneRunner }]);

  /**
   * Auto seo on public dir (_config_yml.public_dir) (run after generated)
   * @param customPath run seo fixer on spesific folder
   * @returns
   */
  seo(customPath?: string | null | undefined) {
    return new Bluebird((resolve) => {
      taskSeo(null, customPath || join(this.cwd, this.config.public_dir)).once('end', function () {
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
  copy(): Promise<void> {
    const config = this.config;
    return new Promise(function (resolve) {
      const streamer = pcopy.copyAllPosts(undefined, config);
      streamer.on('end', function () {
        // wait all handler to be closed
        setTimeout(() => {
          resolve(null);
        }, 3000);
      });
    });
  }

  /**
   * Anonymize external links on public dir (_config_yml.public_dir) (run after generated)
   * @param customPath run anonymizer external links on spesific folder
   * @returns
   */
  safelink(customPath?: string | null | undefined) {
    return new Bluebird((resolve) => {
      taskSafelink(null, customPath || join(this.cwd, this.config.public_dir)).once('end', function () {
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
    await hexo.exit();
  }

  /**
   * clean cache, auto generated posts, etc
   * @see {@link cleaner.cleanDb}
   * @see {@link cleaner.cleanArchive}
   */
  async clean(opt?: 'all' | 'archive' | 'database' | 'post') {
    if (opt === 'all') {
      await cleaner.cleanDb().catch(console.log);
      await cleaner.cleanArchive().catch(console.log);
    } else if (opt === 'archive') {
      await cleaner.cleanArchive().catch(console.log);
    } else if (opt === 'post') {
      await cleaner.cleanGeneratedPosts().catch(console.log);
    } else {
      await cleaner.cleanDb().catch(console.log);
    }
  }

  public deploy = new (class {
    constructor(public superThis: SBG) {
      //
    }
    copy(ignore: string | string[] = []) {
      const self = this.superThis;
      return new Bluebird(function (resolve) {
        deployCopy(self, ignore).once('end', function () {
          setTimeout(() => {
            resolve();
          }, 3000);
        });
      });
    }
  })(this);
}

export default SBG;
export { SBG };
