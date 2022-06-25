import { join } from 'path';
import { extractSubmodule } from '.';

const extract = extractSubmodule(join(__dirname, 'submodule.test.ini'));
console.log(extract);
