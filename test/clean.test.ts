import { toUnix } from 'upath';
process.cwd = () => toUnix(__dirname);

import { cleanDb } from '../src';

cleanDb();
