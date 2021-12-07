"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendToRenderer = void 0;
const electron_1 = require("electron");
const events_1 = __importDefault(require("events"));
require("../../../hexo-seo/packages/js-prototypes/src/Object");
const loadingEvents = new events_1.default();
function sendToRenderer(win, event, arg = {}) {
    if (win instanceof electron_1.BrowserWindow) {
        win.webContents.send(event, arg);
    }
    else {
        win.sender.send(event, arg);
    }
}
exports.sendToRenderer = sendToRenderer;
//# sourceMappingURL=webworker.js.map