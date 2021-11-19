'use strict';
var tslib_1 = require("tslib");
var path = require('path');
var _a = require('electron'), app = _a.app, BrowserWindow = _a.BrowserWindow;
(function () { return (0, tslib_1.__awaiter)(void 0, void 0, void 0, function () {
    return (0, tslib_1.__generator)(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, app.whenReady()];
            case 1:
                _a.sent();
                return [4 /*yield*/, (new BrowserWindow({
                        webPreferences: {
                            nodeIntegration: true
                        }
                    })).loadFile(path.join(__dirname, 'fixture-toggle.html'))];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZml4dHVyZS10b2dnbGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvY29udGV4dC1tZW51L2ZpeHR1cmVzL2ZpeHR1cmUtdG9nZ2xlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQzs7QUFDYixJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDdkIsSUFBQSxLQUF1QixPQUFPLENBQUMsVUFBVSxDQUFDLEVBQXpDLEdBQUcsU0FBQSxFQUFFLGFBQWEsbUJBQXVCLENBQUM7QUFFakQsQ0FBQzs7O29CQUNBLHFCQUFNLEdBQUcsQ0FBQyxTQUFTLEVBQUUsRUFBQTs7Z0JBQXJCLFNBQXFCLENBQUM7Z0JBRXRCLHFCQUFNLENBQUMsSUFBSSxhQUFhLENBQUM7d0JBQ3hCLGNBQWMsRUFBRTs0QkFDZixlQUFlLEVBQUUsSUFBSTt5QkFDckI7cUJBQ0QsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLHFCQUFxQixDQUFDLENBQUMsRUFBQTs7Z0JBSnpELFNBSXlELENBQUM7Ozs7S0FDMUQsQ0FBQyxFQUFFLENBQUMifQ==