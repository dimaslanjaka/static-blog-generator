import { join } from 'path';
import { extractSubmodule } from './git';

const extract = extractSubmodule(join(__dirname, 'git.submodule.test.ini'));
console.log(extract);
