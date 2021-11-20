"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendToRenderer = void 0;
var tslib_1 = require("tslib");
var events_1 = (0, tslib_1.__importDefault)(require("events"));
require("../../../hexo-seo/packages/js-prototypes/src/Object");
var loadingEvents = new events_1.default();
function sendToRenderer(win, event, arg) {
    if (arg === void 0) { arg = {}; }
    win.webContents.send(event, arg);
}
exports.sendToRenderer = sendToRenderer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2Vid29ya2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2VsZWN0cm9uLXV0aWxzL3dlYndvcmtlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsK0RBQWtDO0FBQ2xDLCtEQUE2RDtBQUU3RCxJQUFNLGFBQWEsR0FBRyxJQUFJLGdCQUFZLEVBQUUsQ0FBQztBQUN6QyxTQUFnQixjQUFjLENBQzVCLEdBQTJCLEVBQzNCLEtBQWEsRUFDYixHQUF1QjtJQUF2QixvQkFBQSxFQUFBLFFBQXVCO0lBRXZCLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztBQUNuQyxDQUFDO0FBTkQsd0NBTUMifQ==