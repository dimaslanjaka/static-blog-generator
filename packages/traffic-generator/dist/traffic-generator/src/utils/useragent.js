"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.random = void 0;
const user_agent_json_1 = __importDefault(require("./user-agent.json"));
require("../../../hexo-seo/packages/js-prototypes/src/Array");
/**
 * All User-Agents
 */
exports.default = user_agent_json_1.default;
/**
 * Random User-Agent
 * @returns
 */
const random = () => {
    return user_agent_json_1.default.shuffle().random();
};
exports.random = random;
//# sourceMappingURL=useragent.js.map