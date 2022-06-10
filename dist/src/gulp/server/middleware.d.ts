import Bluebird from 'bluebird';
import { TaskFunction } from 'gulp';
import '../tasks/generate';
import './gen-middleware';
export declare const middlewareCopyAssets: (...fn: TaskFunction[] | string[]) => Bluebird<unknown>;
declare const ServerMiddleWare: import('browser-sync').Options['middleware'];
export default ServerMiddleWare;
export { ServerMiddleWare };
