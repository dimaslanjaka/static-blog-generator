import Hexo from 'hexo';
import { Nullable } from 'hexo-post-parser';
import { fetchConfig, getConfig, setConfig } from 'sbg-utility/dist/config/_config';
import { noop, scheduler } from 'sbg-utility/dist/utils';
import { chain } from 'sbg-utility/dist/utils/chain';
import { join } from 'upath';
import * as cleaner from './clean';
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
    this.cwd = cwd;
    fetchConfig(cwd);
    options = Object.assign(this.config, options || {}, { cwd });

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
   * run files ends with `standalone.js` inside source posts {@link standaloneRunner}
   * @returns
   */
  standalone = () => chain([{ callback: standaloneRunner }]);

  /**
   * Auto seo on public dir (_config_yml.public_dir) (run after generated)
   * @returns
   */
  seo = () => taskSeo(null, join(this.cwd, this.config.public_dir));

  /**
   * Copy all **src-post** to **source/_posts** (run before generate)
   * * see the method {@link pcopy.copyAllPosts}
   * @returns
   */
  copy = () => chain([{ callback: () => pcopy.copyAllPosts(undefined, this.config) }]);

  /**
   * Anonymize external links on public dir (_config_yml.public_dir) (run after generated)
   * @returns
   */
  safelink = () => taskSafelink(noop, join(this.cwd, getConfig().public_dir));

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
}

export default SBG;
export { SBG };
