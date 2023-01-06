import { join } from 'path';
import { getModifiedDateOfFile } from './dateFile';

getModifiedDateOfFile(join(__dirname, 'cache.ts')).then(console.log);
