"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.image_base64_encode = void 0;
var tslib_1 = require("tslib");
var fs_extra_1 = tslib_1.__importDefault(require("fs-extra"));
/**
 * function to encode file data to base64 encoded string
 * @param file path file
 * @returns
 */
function image_base64_encode(file) {
    // read binary data
    var bitmap = fs_extra_1.default.readFileSync(file);
    // convert binary data to base64 encoded string
    return bitmap.toString('base64');
}
exports.image_base64_encode = image_base64_encode;
//# sourceMappingURL=images.js.map