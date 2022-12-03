import { toUnix } from 'upath';
import SBG from '../src/api';
process.cwd = () => toUnix(__dirname);

const c = new SBG(__dirname);
c.copy();
c.generate();
