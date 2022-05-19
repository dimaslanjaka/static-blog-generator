"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dateMapper = void 0;
const tslib_1 = require("tslib");
const moment_1 = tslib_1.__importDefault(require("moment"));
/**
 * HexoJS date formatter
 * * Playground Test {@link https://codepen.io/dimaslanjaka/pen/LYegjaV}
 */
class dateMapper {
    constructor(date) {
        this.format = (pattern) => this.data.format(pattern);
        this.year = () => this.data.format('YYYY');
        this.toString = () => this.data.format('YYYY-MM-DDTHH:mm:ssZ');
        if (typeof date == 'string') {
            this.data = (0, moment_1.default)(date);
        }
    }
}
exports.dateMapper = dateMapper;
//# sourceMappingURL=dateMapper.js.map