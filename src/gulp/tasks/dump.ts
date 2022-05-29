import { writeFile } from 'fs';
import gulp from 'gulp';
import { join } from 'upath';
import { json_encode } from '../../node/JSON';
import { sortedObject } from '../../node/object-utility';
import config, { theme_config, tmp } from '../../types/_config';

export const dumpEnv = async () => {
  writeFile(tmp('config.json'), json_encode(sortedObject(config), 2), (err) => {
    if (!err) console.log('project config dump on', tmp('config.json'));
  });
  writeFile(tmp('theme_config.json'), json_encode(theme_config, 2), (err) => {
    if (!err) console.log('theme config dump on', tmp('theme_config.json'));
  });

  writeFile(tmp('env.json'), json_encode(process.env, 2), (err) => {
    if (!err) console.log('theme config dump on', tmp('theme_config.json'));
  });
};

gulp.task('dump:posts', (done) => {
  require(join(__dirname, 'src/node/cache-post.test.ts'));
  done();
});

gulp.task('dump', dumpEnv);
