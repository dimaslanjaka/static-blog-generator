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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNkb20uanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJzcmMvbm9kZS9qc2RvbS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLCtCQUE4QjtBQUU5QjtJQUFBO1FBQUEsaUJBMEJDO1FBekJDLGNBQVMsR0FBNkIsRUFBRSxDQUFDO1FBTXpDLFVBQUssR0FBRyxVQUFDLEdBQVc7WUFDbEIsS0FBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLGFBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUMvQixJQUFNLFFBQVEsR0FBYSxLQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUM7WUFDekQsT0FBTyxRQUFRLENBQUM7UUFDbEIsQ0FBQyxDQUFDO0lBZUosQ0FBQztJQXRCQyxvQkFBSyxHQUFMO1FBQ0UsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDL0IsQ0FBQztJQU1ELHdCQUFTLEdBQVQ7UUFDRSxJQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ3pDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNiLE9BQU8sTUFBTSxDQUFDO0lBQ2hCLENBQUM7SUFDRCxtQkFBSSxHQUFKO1FBQ0UsSUFBTSxHQUFHLEdBQWEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDO1FBQ3BELE9BQU8sR0FBRyxDQUFDLElBQUksQ0FBQztJQUNsQixDQUFDO0lBQ0QsdUJBQVEsR0FBUjtRQUNFLElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsU0FBUyxDQUFDO1FBQ3ZFLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNiLE9BQU8sTUFBTSxDQUFDO0lBQ2hCLENBQUM7SUFDSCxXQUFDO0FBQUQsQ0FBQyxBQTFCRCxJQTBCQztBQUVELGtCQUFlLElBQUksQ0FBQyJ9