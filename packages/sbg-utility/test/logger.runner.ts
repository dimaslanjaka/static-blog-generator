process.env.DEBUG = 'sbg-*,sbg';

import * as dist from '../dist/index';
import * as src from '../src/index';

src.Logger.log('from src');
src.sbgDebug('test')('hello world');

dist.Logger.log('from dist');
dist.sbgDebug('test')('hello world');
