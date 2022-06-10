"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.array_wrapper = exports.array_wrap = exports.ArrayWrapper = void 0;
/** @template T */
var ArrayWrapper = /** @class */ (function (_super) {
    __extends(ArrayWrapper, _super);
    function ArrayWrapper() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ArrayWrapper.prototype.each = function (callbackfn) {
        return this.forEach(callbackfn);
    };
    /**
     * Remove an item from the list and return the removed item
     * @param item
     * @return
     */
    ArrayWrapper.prototype.remove = function (item) {
        var index = this.indexOf(item);
        if (index === -1) {
            throw new Error("".concat(item, " not in list"));
        }
        this.splice(index, 1);
        return item;
    };
    return ArrayWrapper;
}(Array));
exports.ArrayWrapper = ArrayWrapper;
function array_wrap(arr) {
    if (Array.isArray(arr)) {
        var newArr = arr;
        newArr.each = arr.forEach;
        newArr['each'] = arr.forEach;
        return newArr;
    }
    return arr;
}
exports.array_wrap = array_wrap;
exports.array_wrapper = array_wrap;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJyYXktd3JhcHBlci5qcyIsInNvdXJjZVJvb3QiOiIuL3NyYy8iLCJzb3VyY2VzIjpbInNyYy9ub2RlL2FycmF5LXdyYXBwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsa0JBQWtCO0FBQ2xCO0lBQXFDLGdDQUFRO0lBQTdDOztJQWlCQSxDQUFDO0lBaEJDLDJCQUFJLEdBQUosVUFBSyxVQUE2RDtRQUNoRSxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDbEMsQ0FBQztJQUNEOzs7O09BSUc7SUFDSCw2QkFBTSxHQUFOLFVBQU8sSUFBUztRQUNkLElBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDakMsSUFBSSxLQUFLLEtBQUssQ0FBQyxDQUFDLEVBQUU7WUFDaEIsTUFBTSxJQUFJLEtBQUssQ0FBQyxVQUFHLElBQUksaUJBQWMsQ0FBQyxDQUFDO1NBQ3hDO1FBQ0QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDdEIsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBQ0gsbUJBQUM7QUFBRCxDQUFDLEFBakJELENBQXFDLEtBQUssR0FpQnpDO0FBakJZLG9DQUFZO0FBdUJ6QixTQUFnQixVQUFVLENBQ3hCLEdBQU07SUFFTixJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUU7UUFDdEIsSUFBTSxNQUFNLEdBQUcsR0FBRyxDQUFDO1FBQ25CLE1BQU0sQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQztRQUMxQixNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQztRQUM3QixPQUFPLE1BQU0sQ0FBQztLQUNmO0lBQ0QsT0FBTyxHQUFHLENBQUM7QUFDYixDQUFDO0FBVkQsZ0NBVUM7QUFDWSxRQUFBLGFBQWEsR0FBRyxVQUFVLENBQUMifQ==