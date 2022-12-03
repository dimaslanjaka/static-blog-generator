import { join, toUnix } from 'upath';
import ProjectConfig from './gulp.config';
import { copyAllPosts } from './gulp.post';
import { safelinkProcess } from './gulp.safelink';
import { autoSeo } from './gulp.seo';

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
   * Auto seo on public dir (run after generated)
   * @returns
   */
  seo = () => autoSeo(join(this.base, ProjectConfig.public_dir));

  /**
   * Copy all **src-post** to **source/_posts**
   * * see the method {@link copyAllPosts}
   * @returns
   */
  copy = () => copyAllPosts();

  /**
   * Anonymize external links
   * @returns
   */
  safelink = () => safelinkProcess();
}

export default SBG;
