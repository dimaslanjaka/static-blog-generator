import { join } from 'path';
import { trueCasePathSync } from '../src/utils/filemanager/case-path';

const _current = trueCasePathSync(__filename);
const nonExist = trueCasePathSync(join(__dirname, 'nonExist.file'), { unix: true });

console.log(_current, nonExist);
