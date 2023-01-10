import { config } from './config';
import * as gutils from './gulp-utils';
import * as utils from './utils';

export const Logger = utils.logger;

export { utils, config, gutils };
const sbgUtils = Object.assign({}, utils, config);
export default sbgUtils;
