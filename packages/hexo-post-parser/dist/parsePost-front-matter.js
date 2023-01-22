"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePostFM = void 0;
const front_matter_1 = __importDefault(require("front-matter"));
/**
 * parse post using front-matter
 * @param content markdown post string
 * @returns
 */
function parsePostFM(content) {
    return (0, front_matter_1.default)(content, { allowUnsafe: true });
}
exports.parsePostFM = parsePostFM;
//# sourceMappingURL=parsePost-front-matter.js.map