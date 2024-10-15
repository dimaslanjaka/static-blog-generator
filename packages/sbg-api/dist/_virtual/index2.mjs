import { getDefaultExportFromCjs } from './_commonjsHelpers.mjs';
import { __require as requireFollowRedirects } from '../node_modules/follow-redirects/index.mjs';

var followRedirectsExports = requireFollowRedirects();
var followRedirects = /*@__PURE__*/getDefaultExportFromCjs(followRedirectsExports);

export { followRedirects as default };
