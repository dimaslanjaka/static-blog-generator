"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tsd_1 = require("tsd");
const electron_1 = require("electron");
const contextMenu = require(".");
(0, tsd_1.expectType)(contextMenu());
contextMenu({
    append: () => [
        {
            label: 'Unicorn',
            enabled: false
        }
    ]
});
electron_1.app.on('web-contents-created', (event, webContents) => {
    contextMenu({
        prepend: (defaultActions, parameters) => [{
                label: 'Rainbow',
                visible: parameters.mediaType === 'image'
            }],
        window: webContents
    });
});
//# sourceMappingURL=index.test-d.js.map