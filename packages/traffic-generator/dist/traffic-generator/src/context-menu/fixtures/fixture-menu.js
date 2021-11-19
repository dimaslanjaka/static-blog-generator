'use strict';
var tslib_1 = require("tslib");
var path = require('path');
var _a = require('electron'), app = _a.app, BrowserWindow = _a.BrowserWindow;
var contextMenu = require('..');
contextMenu({
    menu: function (actions) { return [
        actions.separator(),
        actions.copyLink({
            transform: function (content) { return "modified_link_".concat(content); }
        }),
        actions.separator(),
        {
            label: 'Unicorn'
        },
        actions.separator(),
        actions.copy({
            transform: function (content) { return "modified_copy_".concat(content); }
        }),
        {
            label: 'Invisible',
            visible: false
        },
        actions.paste({
            transform: function (content) { return "modified_paste_".concat(content); }
        })
    ]; }
});
(function () { return (0, tslib_1.__awaiter)(void 0, void 0, void 0, function () {
    return (0, tslib_1.__generator)(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, app.whenReady()];
            case 1:
                _a.sent();
                return [4 /*yield*/, (new BrowserWindow({
                        webPreferences: {
                            spellcheck: true
                        }
                    })).loadFile(path.join(__dirname, 'fixture.html'))];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZml4dHVyZS1tZW51LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2NvbnRleHQtbWVudS9maXh0dXJlcy9maXh0dXJlLW1lbnUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFDOztBQUNiLElBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUN2QixJQUFBLEtBR0YsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUZ0QixHQUFHLFNBQUEsRUFDSCxhQUFhLG1CQUNTLENBQUM7QUFDeEIsSUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBRWxDLFdBQVcsQ0FBQztJQUNYLElBQUksRUFBRSxVQUFBLE9BQU8sSUFBSSxPQUFBO1FBQ2hCLE9BQU8sQ0FBQyxTQUFTLEVBQUU7UUFDbkIsT0FBTyxDQUFDLFFBQVEsQ0FBQztZQUNoQixTQUFTLEVBQUUsVUFBQSxPQUFPLElBQUksT0FBQSx3QkFBaUIsT0FBTyxDQUFFLEVBQTFCLENBQTBCO1NBQ2hELENBQUM7UUFDRixPQUFPLENBQUMsU0FBUyxFQUFFO1FBQ25CO1lBQ0MsS0FBSyxFQUFFLFNBQVM7U0FDaEI7UUFDRCxPQUFPLENBQUMsU0FBUyxFQUFFO1FBQ25CLE9BQU8sQ0FBQyxJQUFJLENBQUM7WUFDWixTQUFTLEVBQUUsVUFBQSxPQUFPLElBQUksT0FBQSx3QkFBaUIsT0FBTyxDQUFFLEVBQTFCLENBQTBCO1NBQ2hELENBQUM7UUFDRjtZQUNDLEtBQUssRUFBRSxXQUFXO1lBQ2xCLE9BQU8sRUFBRSxLQUFLO1NBQ2Q7UUFDRCxPQUFPLENBQUMsS0FBSyxDQUFDO1lBQ2IsU0FBUyxFQUFFLFVBQUEsT0FBTyxJQUFJLE9BQUEseUJBQWtCLE9BQU8sQ0FBRSxFQUEzQixDQUEyQjtTQUNqRCxDQUFDO0tBQ0YsRUFwQmdCLENBb0JoQjtDQUNELENBQUMsQ0FBQztBQUVILENBQUM7OztvQkFDQSxxQkFBTSxHQUFHLENBQUMsU0FBUyxFQUFFLEVBQUE7O2dCQUFyQixTQUFxQixDQUFDO2dCQUV0QixxQkFBTSxDQUFDLElBQUksYUFBYSxDQUFDO3dCQUN4QixjQUFjLEVBQUU7NEJBQ2YsVUFBVSxFQUFFLElBQUk7eUJBQ2hCO3FCQUNELENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxjQUFjLENBQUMsQ0FBQyxFQUFBOztnQkFKbEQsU0FJa0QsQ0FBQzs7OztLQUNuRCxDQUFDLEVBQUUsQ0FBQyJ9