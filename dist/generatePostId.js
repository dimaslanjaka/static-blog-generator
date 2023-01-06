"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePostId = void 0;
const uuid_1 = __importDefault(require("./node/uuid"));
/**
 * generate post id using uuid v4
 * @param meta
 * @returns
 */
function generatePostId(meta) {
    let id;
    if (typeof meta === 'object') {
        if ('title' in meta && 'webtitle' in meta) {
            id = meta.title + meta.webtitle;
        }
        else if ('description' in meta) {
            id = meta.description;
        }
        else if ('subtitle' in meta) {
            id = meta.subtitle;
        }
        else if ('excerpt' in meta) {
            id = meta.excerpt;
        }
        else if ('title' in meta) {
            id = meta.title;
        }
    }
    else if (typeof meta === 'string') {
        id = meta;
    }
    return (0, uuid_1.default)(id);
}
exports.generatePostId = generatePostId;
//# sourceMappingURL=generatePostId.js.map