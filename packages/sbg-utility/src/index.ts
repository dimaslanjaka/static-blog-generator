import * as config from './config';
import * as globals from './globals';
import * as gutils from './gulp-utils';
import * as utils from './utils';

export * from './config';
export * from './gulp-utils';
export * from './utils';
export { utils, config, gutils };
//
const sbgUtils = {
  ...utils,
  ...config,
  ...globals,
  ...gutils,
  ...utils.logger,
  ...utils.array,
  ...utils.string,
  ...utils.chain
};
export default sbgUtils;

//
