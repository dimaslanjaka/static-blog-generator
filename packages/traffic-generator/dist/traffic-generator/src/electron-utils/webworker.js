"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendToRenderer = void 0;
const events_1 = __importDefault(require("events"));
require("../../../hexo-seo/packages/js-prototypes/src/Object");
const loadingEvents = new events_1.default();
function sendToRenderer(win, event, arg = {}) {
    win.webContents.send(event, arg);
}
exports.sendToRenderer = sendToRenderer;
//# sourceMappingURL=webworker.js.map