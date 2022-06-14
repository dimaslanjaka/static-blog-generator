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
    /**
     * serialize html and close instance
     * @returns
     */
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNkb20uanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJzcmMvbm9kZS9qc2RvbS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLCtCQUE4QjtBQUU5QjtJQUFBO1FBQUEsaUJBOEJDO1FBN0JDLGNBQVMsR0FBNkIsRUFBRSxDQUFDO1FBTXpDLFVBQUssR0FBRyxVQUFDLEdBQVc7WUFDbEIsS0FBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLGFBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUMvQixJQUFNLFFBQVEsR0FBYSxLQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUM7WUFDekQsT0FBTyxRQUFRLENBQUM7UUFDbEIsQ0FBQyxDQUFDO0lBbUJKLENBQUM7SUExQkMsb0JBQUssR0FBTDtRQUNFLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQy9CLENBQUM7SUFNRDs7O09BR0c7SUFDSCx3QkFBUyxHQUFUO1FBQ0UsSUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUN6QyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDYixPQUFPLE1BQU0sQ0FBQztJQUNoQixDQUFDO0lBQ0QsbUJBQUksR0FBSjtRQUNFLElBQU0sR0FBRyxHQUFhLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQztRQUNwRCxPQUFPLEdBQUcsQ0FBQyxJQUFJLENBQUM7SUFDbEIsQ0FBQztJQUNELHVCQUFRLEdBQVI7UUFDRSxJQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLFNBQVMsQ0FBQztRQUN2RSxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDYixPQUFPLE1BQU0sQ0FBQztJQUNoQixDQUFDO0lBQ0gsV0FBQztBQUFELENBQUMsQUE5QkQsSUE4QkM7QUFFRCxrQkFBZSxJQUFJLENBQUMifQ==