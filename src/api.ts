import Hexo from 'hexo';
import { join } from 'upath';
import { cleanDb, cleanOldArchives } from './gulp.clean';
import { getConfig, setConfig } from './gulp.config';
import { asyncCopyGen } from './gulp.deploy';
import { copyAllPosts } from './gulp.post';
import { safelinkProcess } from './gulp.safelink';
import { autoSeo } from './gulp.seo';
import standaloneRunner from './gulp.standalone';
import noop from './utils/noop';

class SBG {
  cwd: string;
  config = getConfig();
  /**
   * Static blog generator
   * @param cwd base folder
   */
  constructor(cwd: null | string = null) {
    if (typeof cwd === 'string') {
      this.cwd = cwd;
      this.config = setConfig({ cwd });
    }
  }

  standalone = () => standaloneRunner();

  /**
   * Auto seo on public dir (_config_yml.public_dir) (run after generated)
   * @returns
   */
  seo = () => autoSeo(join(this.cwd, getConfig().public_dir));

  /**
   * Copy all **src-post** to **source/_posts** (run before generate)
   * * see the method {@link copyAllPosts}
   * @returns
   */
  copy = function () {
    return new Promise((resolve) => {
      copyAllPosts().once('end', resolve);
    });
  };

  /**
   * Anonymize external links on public dir (_config_yml.public_dir) (run after generated)
   * @returns
   */
  safelink = () => safelinkProcess(noop, join(this.cwd, getConfig().public_dir));

  /**
   * generate site with hexo
   */
  async generate() {
    const instance = new Hexo(this.cwd);
    // hexo init
    await instance.init().catch(noop);
    // hexo generate
    await instance.call('generate').catch(noop);
  }

  async deploy() {
    // run generate task
    await this.generate();
    // copy generated files to deployment directory
    await asyncCopyGen();
    // deployment start
    const config = getConfig();
    const { github } = config.deploy;
    if (!github) return;
    await github.init().catch(noop);
    await github.setremote(config.repo).catch(noop);
    await github.setuser(config.username).catch(noop);
    await github.setemail(config.email).catch(noop);
    await github.setbranch(config.branch).catch(noop);
  }

  /**
   * clean cache, auto generated posts, etc
   * @see {@link cleanDb}
   * @see {@link cleanOldArchives}
   */
  clean(opt?: 'all') {
    if (opt !== 'all') {
      return cleanDb();
    } else {
      return cleanOldArchives();
    }
  }
}

export default SBG;
