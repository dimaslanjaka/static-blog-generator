"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.obj = exports.buildPost = exports.parsePost = exports.parsePermalink = void 0;
require("./a_index");
const buildPost_1 = require("./buildPost");
Object.defineProperty(exports, "buildPost", { enumerable: true, get: function () { return buildPost_1.buildPost; } });
const parsePost_1 = require("./parsePost");
Object.defineProperty(exports, "parsePost", { enumerable: true, get: function () { return parsePost_1.parsePost; } });
var parsePermalink_1 = require("./parsePermalink");
Object.defineProperty(exports, "parsePermalink", { enumerable: true, get: function () { return parsePermalink_1.parsePermalink; } });
exports.obj = { parsePost: parsePost_1.parsePost, buildPost: buildPost_1.buildPost };
exports.default = exports.obj;
//# sourceMappingURL=index.js.map