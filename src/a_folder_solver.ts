import { existsSync, writeFileSync } from 'fs-extra';
import { join } from 'upath';

// generate empty config if not exists
[
  join(__dirname, 'types/_config_project.json'),
  join(__dirname, 'types/_config_theme.json'),
  join(__dirname, 'types/_config_hashes.json')
].forEach((path) => {
  if (!existsSync(path)) {
    writeFileSync(path, '{}');
  }
});
