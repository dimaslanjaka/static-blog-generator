'use strict';
var tslib_1 = require("tslib");
var path = require('path');
var _a = require('electron'), app = _a.app, BrowserWindow = _a.BrowserWindow;
var contextMenu = require('..');
contextMenu({
    labels: {
        cut: 'Configured Cut',
        copy: 'Configured Copy',
        paste: 'Configured Paste',
        save: 'Configured Save Image',
        saveImageAs: 'Configured Save Image As…',
        copyLink: 'Configured Copy Link',
        saveLinkAs: 'Configured Save Link As…',
        inspect: 'Configured Inspect'
    },
    prepend: function () { return [
        {
            label: 'Unicorn'
        },
        {
            type: 'separator'
        },
        {
            type: 'separator'
        },
        {
            label: 'Invisible',
            visible: false
        },
        {
            type: 'separator'
        },
        {
            type: 'separator'
        }
    ]; },
    append: function () { },
    showCopyImageAddress: true,
    showSaveImageAs: true,
    showInspectElement: false,
    showSaveLinkAs: true
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZml4dHVyZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9jb250ZXh0LW1lbnUvZml4dHVyZXMvZml4dHVyZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7O0FBQ2IsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3ZCLElBQUEsS0FBdUIsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUF6QyxHQUFHLFNBQUEsRUFBRSxhQUFhLG1CQUF1QixDQUFDO0FBQ2pELElBQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUVsQyxXQUFXLENBQUM7SUFDWCxNQUFNLEVBQUU7UUFDUCxHQUFHLEVBQUUsZ0JBQWdCO1FBQ3JCLElBQUksRUFBRSxpQkFBaUI7UUFDdkIsS0FBSyxFQUFFLGtCQUFrQjtRQUN6QixJQUFJLEVBQUUsdUJBQXVCO1FBQzdCLFdBQVcsRUFBRSwyQkFBMkI7UUFDeEMsUUFBUSxFQUFFLHNCQUFzQjtRQUNoQyxVQUFVLEVBQUUsMEJBQTBCO1FBQ3RDLE9BQU8sRUFBRSxvQkFBb0I7S0FDN0I7SUFDRCxPQUFPLEVBQUUsY0FBTSxPQUFBO1FBQ2Q7WUFDQyxLQUFLLEVBQUUsU0FBUztTQUNoQjtRQUNEO1lBQ0MsSUFBSSxFQUFFLFdBQVc7U0FDakI7UUFDRDtZQUNDLElBQUksRUFBRSxXQUFXO1NBQ2pCO1FBQ0Q7WUFDQyxLQUFLLEVBQUUsV0FBVztZQUNsQixPQUFPLEVBQUUsS0FBSztTQUNkO1FBQ0Q7WUFDQyxJQUFJLEVBQUUsV0FBVztTQUNqQjtRQUNEO1lBQ0MsSUFBSSxFQUFFLFdBQVc7U0FDakI7S0FDRCxFQXBCYyxDQW9CZDtJQUNELE1BQU0sRUFBRSxjQUFPLENBQUM7SUFDaEIsb0JBQW9CLEVBQUUsSUFBSTtJQUMxQixlQUFlLEVBQUUsSUFBSTtJQUNyQixrQkFBa0IsRUFBRSxLQUFLO0lBQ3pCLGNBQWMsRUFBRSxJQUFJO0NBQ3BCLENBQUMsQ0FBQztBQUVILENBQUM7OztvQkFDQSxxQkFBTSxHQUFHLENBQUMsU0FBUyxFQUFFLEVBQUE7O2dCQUFyQixTQUFxQixDQUFDO2dCQUV0QixxQkFBTSxDQUFDLElBQUksYUFBYSxDQUFDO3dCQUN4QixjQUFjLEVBQUU7NEJBQ2YsVUFBVSxFQUFFLElBQUk7eUJBQ2hCO3FCQUNELENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxjQUFjLENBQUMsQ0FBQyxFQUFBOztnQkFKbEQsU0FJa0QsQ0FBQzs7OztLQUNuRCxDQUFDLEVBQUUsQ0FBQyJ9