"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = __importDefault(require("."));
function default_1(app) {
    // create context menu in main window
    (0, _1.default)();
    app.on("web-contents-created", (e, contents) => {
        if (contents.getType() == "webview") {
            // set context menu in webviews
            (0, _1.default)({ window: contents });
        }
    });
}
exports.default = default_1;
//# sourceMappingURL=menu2.js.map