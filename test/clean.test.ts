process.cwd = () => __dirname;

import { cleanDb } from '../src';

cleanDb();
