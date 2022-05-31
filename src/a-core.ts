import { existsSync, writeFileSync } from 'fs-extra';
import { join } from 'upath';

// [task] generate empty config if not exists
[
  join(__dirname, 'types/_config_project.json'),
  join(__dirname, 'types/_config_theme.json'),
  join(__dirname, 'types/_config_hashes.json')
].forEach((path) => {
  if (!existsSync(path)) {
    writeFileSync(path, '{}');
  }
});

// declare require types
export declare function require<T>(name: string): T;
