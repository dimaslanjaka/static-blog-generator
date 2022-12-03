import Hexo from 'hexo';
import { join, toUnix } from 'upath';
import ProjectConfig from './gulp.config';
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
  copy = () => copyAllPosts();

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
    await instance.init().catch(noop);
    await instance.call('generate').catch(noop);
  }
}

export default SBG;
