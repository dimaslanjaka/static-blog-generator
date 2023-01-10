import { config } from './config';
import * as gutils from './gulp-utils';
import * as utils from './utils';

export { utils, config, gutils };
export const Logger = utils.logger;

const sbgUtils = Object.assign({}, utils, config);
export default sbgUtils;
