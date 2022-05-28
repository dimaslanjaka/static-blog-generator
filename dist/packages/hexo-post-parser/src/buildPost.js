"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildPost = void 0;
var yaml = __importStar(require("yaml"));
var parsePost_1 = require("./parsePost");
/**
 * Rebuild {@link parsePost} result to markdown post back
 * @param parsed parsed post return {@link parsePost}
 * @returns
 */
function buildPost(parsed) {
    if (!parsed) {
        throw new Error("'parsed' must be instance of `postMap` object, instead " +
            (parsed === null ? 'null' : typeof parsed));
    }
    if (parsed.metadata)
        return "---\n".concat(yaml.stringify(parsed.metadata), "---\n\n").concat(parsed.body);
    return parsed.body;
}
exports.buildPost = buildPost;
function _dummy() {
    return { parsePost: parsePost_1.parsePost };
}
exports.default = buildPost;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVpbGRQb3N0LmpzIiwic291cmNlUm9vdCI6Ii4vc3JjLyIsInNvdXJjZXMiOlsicGFja2FnZXMvaGV4by1wb3N0LXBhcnNlci9zcmMvYnVpbGRQb3N0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEseUNBQTZCO0FBQzdCLHlDQUFpRDtBQUVqRDs7OztHQUlHO0FBQ0gsU0FBZ0IsU0FBUyxDQUFDLE1BQXdCO0lBQ2hELElBQUksQ0FBQyxNQUFNLEVBQUU7UUFDWCxNQUFNLElBQUksS0FBSyxDQUNiLHlEQUF5RDtZQUN2RCxDQUFDLE1BQU0sS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxNQUFNLENBQUMsQ0FDN0MsQ0FBQztLQUNIO0lBRUQsSUFBSSxNQUFNLENBQUMsUUFBUTtRQUNqQixPQUFPLGVBQVEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLG9CQUFVLE1BQU0sQ0FBQyxJQUFJLENBQUUsQ0FBQztJQUN4RSxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUM7QUFDckIsQ0FBQztBQVhELDhCQVdDO0FBRUQsU0FBUyxNQUFNO0lBQ2IsT0FBTyxFQUFFLFNBQVMsdUJBQUEsRUFBRSxDQUFDO0FBQ3ZCLENBQUM7QUFDRCxrQkFBZSxTQUFTLENBQUMifQ==