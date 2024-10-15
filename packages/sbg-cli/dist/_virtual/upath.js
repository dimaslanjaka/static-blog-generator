// sbg-cli v2.0.0 Copyright (c) 2024 Dimas Lanjaka <dimaslanjaka@gmail.com> (https://webmanajemen.com)
import { getDefaultExportFromCjs } from './_commonjsHelpers.js';
import { __require as requireUpath } from '../node_modules/upath/build/code/upath.js';

var upathExports = requireUpath();
var path = /*@__PURE__*/getDefaultExportFromCjs(upathExports);

export { path as default };
