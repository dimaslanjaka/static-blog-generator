import Hexo from 'hexo';
import { join } from 'upath';
import { cleanDb, cleanOldArchives } from './gulp.clean';
import { getConfig, setConfig } from './gulp.config';
import { asyncCopyGen } from './gulp.deploy';
import { copyAllPosts } from './gulp.post';
import { taskSafelink } from './gulp.safelink';
import { taskSeo } from './gulp.seo';
import standaloneRunner from './gulp.standalone';
import noop from './utils/noop';
import scheduler from './utils/scheduler';

class SBG {
  cwd: string;
  config = getConfig();
  setConfig = setConfig;
  getConfig = getConfig;

  /**
   * Static blog generator
   * @param cwd base folder
   */
  constructor(cwd: null | string = null) {
    if (typeof cwd === 'string') {
      this.cwd = cwd;
      this.config = setConfig({ cwd });
    }
    scheduler.register();
  }

  standalone = () => standaloneRunner();

  /**
   * Auto seo on public dir (_config_yml.public_dir) (run after generated)
   * @returns
   */
  seo = () => taskSeo(null, join(this.cwd, getConfig().public_dir));

  /**
   * Copy all **src-post** to **source/_posts** (run before generate)
   * * see the method {@link copyAllPosts}
   * @returns
   */
  copy = async function () {
    return copyAllPosts();
  };

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
