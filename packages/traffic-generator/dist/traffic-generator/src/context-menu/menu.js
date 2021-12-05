"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = __importDefault(require("."));
const electron_1 = require("electron");
function default_1() {
    //console.log("context menu show");
    return (0, _1.default)({
        prepend: (_defaultActions, parameters, _browserWindow) => [
            {
                label: "Rainbow",
                // Only show it when right-clicking images
                visible: parameters.mediaType === "image"
            },
            {
                label: "Search Google",
                // Only show it when right-clicking text
                visible: parameters.selectionText.trim().length > 0,
                click: () => {
                    electron_1.shell
                        .openExternal(`https://google.com/search?q=${encodeURIComponent(parameters.selectionText)}`)
                        .then((r) => console.log(r));
                }
            },
            {
                label: "Open Settings",
                click: () => {
                    const settings = {
                        height: 500,
                        width: 400,
                        titleBarStyle: "hidden",
                        webPreferences: {
                            nodeIntegration: true,
                            enableRemoteModule: true
                        }
                    };
                    if (process.platform == "win32") {
                        settings.frame = false;
                    }
                    else {
                        settings.titleBarStyle = "hidden";
                    }
                    const win = new electron_1.BrowserWindow(settings);
                    win.loadFile("views/settings.html").then((r) => console.log(r));
                }
            }
        ]
    });
}
exports.default = default_1;
//# sourceMappingURL=menu.js.map