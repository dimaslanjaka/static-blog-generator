import { join } from 'path';
import { inspect } from 'util';
import { helpers } from '.';
import { write } from '../../node/filemanager';

write(join(__dirname, 'tmp/inspect.log'), inspect(helpers));
