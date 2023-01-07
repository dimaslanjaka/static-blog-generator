import Hexo from 'hexo';
import { join, toUnix } from 'upath';
import noop from './utils/noop';
import { getConfig } from './_config';

/**
 * get all posts (hexo)
 */
export async function getPosts() {
  const config = getConfig();
  const hexo = new Hexo(config.base_dir);
  await hexo.init().catch(noop);
  await hexo.load().catch(noop);
  const posts = hexo.locals.get('posts');
  if (posts.count() > 0) {
    return posts.map(({ full_source }) => {
      const paths = {
        generated: toUnix(full_source),
        source: join(process.cwd(), config.post_dir),
        public: join(
          join(config.cwd, config.public_dir),
          toUnix(full_source).replace(join(config.cwd, config.source_dir, '_posts'), '')
        )
        //deploy: join(config.deploy.deployDir, toUnix(full_source).replace(join(config.cwd, config.source_dir), ''))
      };
      return paths;
    });
  }
}
