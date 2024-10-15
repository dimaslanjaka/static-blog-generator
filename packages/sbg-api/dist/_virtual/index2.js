import { getDefaultExportFromCjs } from './_commonjsHelpers.js';
import { __require as requireFollowRedirects } from '../node_modules/follow-redirects/index.js';

var followRedirectsExports = requireFollowRedirects();
var followRedirects = /*@__PURE__*/getDefaultExportFromCjs(followRedirectsExports);

export { followRedirects as default };
