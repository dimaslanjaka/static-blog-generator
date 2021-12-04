"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.random = void 0;
var tslib_1 = require("tslib");
var user_agent_json_1 = (0, tslib_1.__importDefault)(require("./user-agent.json"));
require("../../../hexo-seo/packages/js-prototypes/src/Array");
/**
 * All User-Agents
 */
exports.default = user_agent_json_1.default;
/**
 * Random User-Agent
 * @returns
 */
var random = function () {
    return user_agent_json_1.default.shuffle().random();
};
exports.random = random;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlcmFnZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3V0aWxzL3VzZXJhZ2VudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsbUZBQXFDO0FBQ3JDLDhEQUE0RDtBQUM1RDs7R0FFRztBQUNILGtCQUFlLHlCQUFnQixDQUFDO0FBQ2hDOzs7R0FHRztBQUNJLElBQU0sTUFBTSxHQUFHO0lBQ3BCLE9BQWtCLHlCQUFLLENBQUMsT0FBTyxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDN0MsQ0FBQyxDQUFDO0FBRlcsUUFBQSxNQUFNLFVBRWpCIn0=