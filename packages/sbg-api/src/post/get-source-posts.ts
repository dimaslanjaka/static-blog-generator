import Bluebird from 'bluebird';
import glob from 'glob';
import * as hexoPostParser from 'hexo-post-parser';
import { ProjConf, getConfig } from 'sbg-utility';
import path from 'upath';
import { processSinglePost } from './copy';

export interface ResultSourcePosts extends hexoPostParser.postMap {
  full_source: string;
}

/**
 * get all source posts
 * @returns
 */
export function getSourcePosts(config?: ProjConf) {
  return new Bluebird((resolve: (arg: ResultSourcePosts[]) => any) => {
    if (!config) config = getConfig();
    const sourcePostDir = path.join(config.cwd, config.post_dir);
    glob.glob('**/*.md', { cwd: sourcePostDir }).then((matches) => {
      matches = matches.map((p) => path.join(sourcePostDir, p));
      const results: ResultSourcePosts[] = [];
      matches.forEach((p) =>
        processSinglePost(p, function (parsed) {
          results.push(Object.assign(parsed, { full_source: p }));
        })
      );
      resolve(results);
    });
  });
}

export default getSourcePosts;
