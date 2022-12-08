import Bluebird from 'bluebird';
import Hexo from 'hexo';
import { join, toUnix } from 'upath';
import { cleanDb } from './gulp.clean';
import ProjectConfig, { deployConfig } from './gulp.config';
import { asyncCopyGen } from './gulp.deploy';
import { copyAllPosts } from './gulp.post';
import { safelinkProcess } from './gulp.safelink';
import { autoSeo } from './gulp.seo';
import noop from './utils/noop';

class SBG {
  base: string = toUnix(process.cwd());
  /**
   * Static blog generator
   * @param base base folder
   */
  constructor(base: null | string = null) {
    if (typeof base === 'string') this.base = base;
  }

  /**
   * Auto seo on public dir (_config_yml.public_dir) (run after generated)
   * @returns
   */
  seo = () => autoSeo(join(this.base, ProjectConfig.public_dir));

  /**
   * Copy all **src-post** to **source/_posts** (run before generate)
   * * see the method {@link copyAllPosts}
   * @returns
   */
  copy = () => {
    return new Bluebird((resolve) => {
      copyAllPosts().once('end', function () {
        resolve.bind(this)();
      });
    });
  };

  /**
   * Anonymize external links on public dir (_config_yml.public_dir) (run after generated)
   * @returns
   */
  safelink = () => safelinkProcess(noop, join(this.base, ProjectConfig.public_dir));

  /**
   * generate site with hexo
   */
  async generate() {
    const instance = new Hexo(this.base);
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
    const { github, config } = deployConfig();
    await github.init().catch(noop);
    await github.setremote(config.repo).catch(noop);
    await github.setuser(config.username).catch(noop);
    await github.setemail(config.email).catch(noop);
    await github.setbranch(config.branch).catch(noop);
  }

  /**
   * clean cache, auto generated posts, etc
   */
  clean = () => cleanDb();
}

export default SBG;
