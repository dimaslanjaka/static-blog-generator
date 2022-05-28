"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsdom_1 = require("jsdom");
var jdom = /** @class */ (function () {
    function jdom() {
        var _this = this;
        this.instances = {};
        this.parse = function (str) {
            _this.instance = new jsdom_1.JSDOM(str);
            var document = _this.instance.window.document;
            return document;
        };
    }
    jdom.prototype.close = function () {
        this.instance.window.close();
    };
    jdom.prototype.serialize = function () {
        var result = this.instance.serialize();
        this.close();
        return result;
    };
    jdom.prototype.body = function () {
        var doc = this.instance.window.document;
        return doc.body;
    };
    jdom.prototype.toString = function () {
        var result = this.instance.window.document.documentElement.outerHTML;
        this.close();
        return result;
    };
    return jdom;
}());
exports.default = jdom;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNkb20uanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJwYWNrYWdlcy9oZXhvLXBvc3QtcGFyc2VyL3NyYy9ub2RlL2pzZG9tLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsK0JBQThCO0FBRTlCO0lBQUE7UUFBQSxpQkEwQkM7UUF6QkMsY0FBUyxHQUE2QixFQUFFLENBQUM7UUFNekMsVUFBSyxHQUFHLFVBQUMsR0FBVztZQUNsQixLQUFJLENBQUMsUUFBUSxHQUFHLElBQUksYUFBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQy9CLElBQU0sUUFBUSxHQUFhLEtBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQztZQUN6RCxPQUFPLFFBQVEsQ0FBQztRQUNsQixDQUFDLENBQUM7SUFlSixDQUFDO0lBdEJDLG9CQUFLLEdBQUw7UUFDRSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUMvQixDQUFDO0lBTUQsd0JBQVMsR0FBVDtRQUNFLElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDekMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ2IsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQztJQUNELG1CQUFJLEdBQUo7UUFDRSxJQUFNLEdBQUcsR0FBYSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUM7UUFDcEQsT0FBTyxHQUFHLENBQUMsSUFBSSxDQUFDO0lBQ2xCLENBQUM7SUFDRCx1QkFBUSxHQUFSO1FBQ0UsSUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxTQUFTLENBQUM7UUFDdkUsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ2IsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQztJQUNILFdBQUM7QUFBRCxDQUFDLEFBMUJELElBMEJDO0FBRUQsa0JBQWUsSUFBSSxDQUFDIn0=