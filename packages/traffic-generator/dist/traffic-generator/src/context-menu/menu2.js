"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var electron_1 = require("electron");
var _1 = (0, tslib_1.__importDefault)(require("."));
var menu = new electron_1.Menu();
//Basic Menu For Testing
menu.append(new electron_1.MenuItem({
    label: "MenuItem1",
    click: function () {
        console.log("YES");
    }
}));
menu.append(new electron_1.MenuItem({ type: "separator" }));
menu.append(new electron_1.MenuItem({ label: "MenuItem2", type: "checkbox", checked: true }));
function default_1(app) {
    app.on("web-contents-created", function (e, contents) {
        if (contents.getType() == "webview") {
            // set context menu in webview
            (0, _1.default)({ window: contents });
        }
    });
}
exports.default = default_1;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudTIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29udGV4dC1tZW51L21lbnUyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHFDQUEwQztBQUMxQyxvREFBNEI7QUFFNUIsSUFBTSxJQUFJLEdBQUcsSUFBSSxlQUFJLEVBQUUsQ0FBQztBQUV4Qix3QkFBd0I7QUFDeEIsSUFBSSxDQUFDLE1BQU0sQ0FDVCxJQUFJLG1CQUFRLENBQUM7SUFDWCxLQUFLLEVBQUUsV0FBVztJQUNsQixLQUFLLEVBQUU7UUFDTCxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3JCLENBQUM7Q0FDRixDQUFDLENBQ0gsQ0FBQztBQUNGLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxtQkFBUSxDQUFDLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNqRCxJQUFJLENBQUMsTUFBTSxDQUNULElBQUksbUJBQVEsQ0FBQyxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FDdEUsQ0FBQztBQUVGLG1CQUF5QixHQUFpQjtJQUN4QyxHQUFHLENBQUMsRUFBRSxDQUFDLHNCQUFzQixFQUFFLFVBQUMsQ0FBQyxFQUFFLFFBQVE7UUFDekMsSUFBSSxRQUFRLENBQUMsT0FBTyxFQUFFLElBQUksU0FBUyxFQUFFO1lBQ25DLDhCQUE4QjtZQUM5QixJQUFBLFVBQVcsRUFBQyxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDO1NBQ25DO0lBQ0gsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBUEQsNEJBT0MifQ==