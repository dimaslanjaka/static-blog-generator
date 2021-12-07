import '../../../../hexo-seo/packages/js-prototypes/src/Array';
import Promise from 'bluebird';
export { returnObj as returnObj, parser as parse } from './parser/spys.txt';
/**
 * Grab Spys
 * @returns
 */
declare function spys(): Promise<import("./parser/spys.txt").returnObj[]>;
export default spys;
