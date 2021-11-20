"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var _1 = (0, tslib_1.__importDefault)(require("."));
function default_1(app) {
    // create context menu in main window
    (0, _1.default)();
    app.on("web-contents-created", function (e, contents) {
        if (contents.getType() == "webview") {
            // set context menu in webviews
            (0, _1.default)({ window: contents });
        }
    });
}
exports.default = default_1;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudTIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29udGV4dC1tZW51L21lbnUyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG9EQUE0QjtBQUU1QixtQkFBeUIsR0FBaUI7SUFDeEMscUNBQXFDO0lBQ3JDLElBQUEsVUFBVyxHQUFFLENBQUM7SUFDZCxHQUFHLENBQUMsRUFBRSxDQUFDLHNCQUFzQixFQUFFLFVBQUMsQ0FBQyxFQUFFLFFBQVE7UUFDekMsSUFBSSxRQUFRLENBQUMsT0FBTyxFQUFFLElBQUksU0FBUyxFQUFFO1lBQ25DLCtCQUErQjtZQUMvQixJQUFBLFVBQVcsRUFBQyxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDO1NBQ25DO0lBQ0gsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBVEQsNEJBU0MifQ==