"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.internal_helpers = void 0;
var _config_1 = __importDefault(require("../../types/_config"));
exports.internal_helpers = {
    iif: function (cond, value) {
        if (cond)
            return value;
    },
    url_fix: function (str) {
        var u = new URL(str);
        // remove multiple slashes
        u.pathname = u.pathname.replace(/\/+/, '/');
        return u.toString();
    },
    url_for: function (str) {
        var homepage = _config_1.default.url;
        homepage += str.replace(/\/+/, '/');
        return new URL(homepage).toString();
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJuYWwtaGVscGVycy5qcyIsInNvdXJjZVJvb3QiOiIuL3NyYy8iLCJzb3VyY2VzIjpbInNyYy9yZW5kZXJlci9oZWxwZXJzL2ludGVybmFsLWhlbHBlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsZ0VBQXlDO0FBRTVCLFFBQUEsZ0JBQWdCLEdBQUc7SUFDOUIsR0FBRyxFQUFFLFVBQWEsSUFBYSxFQUFFLEtBQVE7UUFDdkMsSUFBSSxJQUFJO1lBQUUsT0FBTyxLQUFLLENBQUM7SUFDekIsQ0FBQztJQUNELE9BQU8sRUFBRSxVQUFDLEdBQVc7UUFDbkIsSUFBTSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDdkIsMEJBQTBCO1FBQzFCLENBQUMsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQzVDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ3RCLENBQUM7SUFDRCxPQUFPLEVBQUUsVUFBQyxHQUFXO1FBQ25CLElBQUksUUFBUSxHQUFHLGlCQUFNLENBQUMsR0FBRyxDQUFDO1FBQzFCLFFBQVEsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztRQUNwQyxPQUFPLElBQUksR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ3RDLENBQUM7Q0FDRixDQUFDIn0=