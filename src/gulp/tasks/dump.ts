import { writeFile } from 'fs';
import gulp from 'gulp';
import { DynamicObject } from '../../types';
import config, { theme_config, tmp } from '../../types/_config';

gulp.task('dump', async () => {
  const sortedObject = (data: DynamicObject) =>
    Object.fromEntries(Object.entries(data).sort());
  writeFile(
    tmp('config.json'),
    JSON.stringify(sortedObject(config), null, 2),
    (err) => {
      if (!err) console.log('project config dump on', tmp('config.json'));
    }
  );
  writeFile(
    tmp('theme_config.json'),
    JSON.stringify(theme_config, null, 2),
    (err) => {
      if (!err) console.log('theme config dump on', tmp('theme_config.json'));
    }
  );
});
