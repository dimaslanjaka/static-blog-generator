import Bluebird from 'bluebird';
import glob from 'glob';
import * as hexoPostParser from 'hexo-post-parser';
import { getConfig } from 'sbg-utility';
import path from 'upath';
import { processSinglePost } from './copy';

export default function getSourcePosts() {
  return new Bluebird((resolve: (arg: hexoPostParser.postMap[]) => any) => {
    const config = getConfig();
    const sourcePostDir = path.join(process.cwd(), config.post_dir);
    glob('**/*.md', { cwd: sourcePostDir }, function (_err, matches) {
      if (!_err) {
        matches = matches.map((p) => path.join(sourcePostDir, p));
        const results: hexoPostParser.postMap[] = [];
        matches.forEach((p) =>
          processSinglePost(p, function (parsed) {
            results.push(parsed);
          })
        );
        resolve(results);
      }
    });
  });
}
