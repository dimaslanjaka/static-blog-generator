"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tsd_1 = require("tsd");
var electron_1 = require("electron");
var contextMenu = require(".");
(0, tsd_1.expectType)(contextMenu());
contextMenu({
    append: function () { return [
        {
            label: 'Unicorn',
            enabled: false
        }
    ]; }
});
electron_1.app.on('web-contents-created', function (event, webContents) {
    contextMenu({
        prepend: function (defaultActions, parameters) { return [{
                label: 'Rainbow',
                visible: parameters.mediaType === 'image'
            }]; },
        window: webContents
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgudGVzdC1kLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbnRleHQtbWVudS9pbmRleC50ZXN0LWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwyQkFBK0I7QUFDL0IscUNBQTZCO0FBQzdCLCtCQUFrQztBQUVsQyxJQUFBLGdCQUFVLEVBQWEsV0FBVyxFQUFFLENBQUMsQ0FBQztBQUV0QyxXQUFXLENBQUM7SUFDWCxNQUFNLEVBQUUsY0FBTSxPQUFBO1FBQ2I7WUFDQyxLQUFLLEVBQUUsU0FBUztZQUNoQixPQUFPLEVBQUUsS0FBSztTQUNkO0tBQ0QsRUFMYSxDQUtiO0NBQ0QsQ0FBQyxDQUFDO0FBRUgsY0FBRyxDQUFDLEVBQUUsQ0FBQyxzQkFBc0IsRUFBRSxVQUFDLEtBQUssRUFBRSxXQUFXO0lBQ2pELFdBQVcsQ0FBQztRQUNYLE9BQU8sRUFBRSxVQUFDLGNBQWMsRUFBRSxVQUFVLElBQUssT0FBQSxDQUFDO2dCQUN6QyxLQUFLLEVBQUUsU0FBUztnQkFDaEIsT0FBTyxFQUFFLFVBQVUsQ0FBQyxTQUFTLEtBQUssT0FBTzthQUN6QyxDQUFDLEVBSHVDLENBR3ZDO1FBQ0YsTUFBTSxFQUFFLFdBQVc7S0FDbkIsQ0FBQyxDQUFDO0FBQ0osQ0FBQyxDQUFDLENBQUMifQ==