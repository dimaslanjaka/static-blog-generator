import '../tasks/generate';
import './gen-middleware';
declare const ServerMiddleWare: import('browser-sync').Options['middleware'];
export default ServerMiddleWare;
export { ServerMiddleWare };
