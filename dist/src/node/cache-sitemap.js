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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var cache_1 = __importStar(require("./cache"));
//let sitemapCache: CacheFile;
var Sitemap = /** @class */ (function (_super) {
    __extends(Sitemap, _super);
    function Sitemap() {
        return _super.call(this, 'sitemap') || this;
        // initialize instance
        //sitemapCache = new CacheFile('sitemap');
    }
    Sitemap.prototype.getValues = function (opt) {
        if (opt === void 0) { opt = cache_1.defaultResovableValue; }
        return _super.prototype.getValues.call(this, opt);
    };
    Sitemap.prototype.add = function (obj) {
        _super.prototype.set.call(this, obj.title, obj);
        return this;
    };
    Sitemap.prototype.getTotal = function () {
        return _super.prototype.getValues.call(this).length;
    };
    return Sitemap;
}(cache_1.default));
exports.default = Sitemap;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FjaGUtc2l0ZW1hcC5qcyIsInNvdXJjZVJvb3QiOiIuL3NyYy8iLCJzb3VyY2VzIjpbInNyYy9ub2RlL2NhY2hlLXNpdGVtYXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBLCtDQUEyRDtBQWdCM0QsOEJBQThCO0FBQzlCO0lBQXFDLDJCQUFTO0lBQzVDO2VBQ0Usa0JBQU0sU0FBUyxDQUFDO1FBQ2hCLHNCQUFzQjtRQUN0QiwwQ0FBMEM7SUFDNUMsQ0FBQztJQUNELDJCQUFTLEdBQVQsVUFBVSxHQUEyQjtRQUEzQixvQkFBQSxFQUFBLE1BQU0sNkJBQXFCO1FBQ25DLE9BQU8saUJBQU0sU0FBUyxZQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFDRCxxQkFBRyxHQUFILFVBQUksR0FBZ0I7UUFDbEIsaUJBQU0sR0FBRyxZQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDMUIsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBQ0QsMEJBQVEsR0FBUjtRQUNFLE9BQU8saUJBQU0sU0FBUyxXQUFFLENBQUMsTUFBTSxDQUFDO0lBQ2xDLENBQUM7SUFDSCxjQUFDO0FBQUQsQ0FBQyxBQWhCRCxDQUFxQyxlQUFTLEdBZ0I3QyJ9