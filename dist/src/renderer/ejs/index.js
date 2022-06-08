"use strict";
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
exports.helpers = exports.renderFile = void 0;
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
var ejs = __importStar(require("ejs"));
var filemanager_1 = require("../../node/filemanager");
var _config_1 = __importStar(require("../../types/_config"));
var author = __importStar(require("./helper/author"));
var date = __importStar(require("./helper/date"));
var excerpt = __importStar(require("./helper/excerpt"));
var keywords = __importStar(require("./helper/keywords"));
var tag = __importStar(require("./helper/labels"));
var locale = __importStar(require("./helper/locales"));
var thumbnail = __importStar(require("./helper/thumbnail"));
var homepage = new URL(_config_1.default.url);
var internal_helpers = {
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
        homepage.pathname = str.replace(/\/+/, '/');
        return homepage.toString();
    }
};
var helpers = Object.assign(author, date, locale, thumbnail, keywords, excerpt, tag, internal_helpers);
exports.helpers = helpers;
function renderFile(file, opts) {
    if (opts === void 0) { opts = {}; }
    //opts._ = helpers;
    opts.root = (0, filemanager_1.join)(_config_1.theme_dir, 'layout/layout.ejs');
    opts = Object.assign(helpers, opts);
    return ejs.renderFile(file, opts);
}
exports.renderFile = renderFile;
function render(content, opts) {
    if (opts === void 0) { opts = {}; }
    opts.root = (0, filemanager_1.join)(_config_1.theme_dir, 'layout/layout.ejs');
    opts = Object.assign(helpers, opts);
    var render = ejs.render(content, opts);
    //if (opts.async) return Promise.resolve(render);
    return render;
}
var ejs_object = {
    ejs: ejs,
    helpers: helpers,
    renderFile: renderFile,
    resolveInclude: ejs.resolveInclude,
    compile: ejs.compile,
    render: render,
    clearCache: ejs.clearCache,
    escapeXML: ejs.escapeXML,
    VERSION: ejs.VERSION,
    name: ejs.name,
    cache: ejs.cache,
    fileLoader: ejs.fileLoader,
    localsName: ejs.localsName,
    openDelimiter: ejs.openDelimiter,
    closeDelimiter: ejs.closeDelimiter,
    delimiter: ejs.delimiter,
    promiseImpl: ejs.promiseImpl,
    Template: ejs.Template
};
exports.default = ejs_object;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJzcmMvcmVuZGVyZXIvZWpzL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsc0VBQXNFO0FBQ3RFLHVDQUEyQjtBQUMzQixzREFBOEM7QUFHOUMsNkRBQWtFO0FBQ2xFLHNEQUEwQztBQUMxQyxrREFBc0M7QUFDdEMsd0RBQTRDO0FBQzVDLDBEQUE4QztBQUM5QyxtREFBdUM7QUFDdkMsdURBQTJDO0FBQzNDLDREQUFnRDtBQUVoRCxJQUFNLFFBQVEsR0FBRyxJQUFJLEdBQUcsQ0FBQyxpQkFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3JDLElBQU0sZ0JBQWdCLEdBQUc7SUFDdkIsR0FBRyxFQUFFLFVBQWEsSUFBYSxFQUFFLEtBQVE7UUFDdkMsSUFBSSxJQUFJO1lBQUUsT0FBTyxLQUFLLENBQUM7SUFDekIsQ0FBQztJQUNELE9BQU8sRUFBRSxVQUFDLEdBQVc7UUFDbkIsSUFBTSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDdkIsMEJBQTBCO1FBQzFCLENBQUMsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQzVDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ3RCLENBQUM7SUFDRCxPQUFPLEVBQUUsVUFBQyxHQUFXO1FBQ25CLFFBQVEsQ0FBQyxRQUFRLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDNUMsT0FBTyxRQUFRLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDN0IsQ0FBQztDQUNGLENBQUM7QUFZRixJQUFNLE9BQU8sR0FBaUIsTUFBTSxDQUFDLE1BQU0sQ0FDekMsTUFBTSxFQUNOLElBQUksRUFDSixNQUFNLEVBQ04sU0FBUyxFQUNULFFBQVEsRUFDUixPQUFPLEVBQ1AsR0FBRyxFQUNILGdCQUFnQixDQUNqQixDQUFDO0FBOENPLDBCQUFPO0FBckNoQixTQUFnQixVQUFVLENBQUMsSUFBWSxFQUFFLElBQW9CO0lBQXBCLHFCQUFBLEVBQUEsU0FBb0I7SUFDM0QsbUJBQW1CO0lBQ25CLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBQSxrQkFBSSxFQUFDLG1CQUFTLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztJQUNqRCxJQUFJLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDcEMsT0FBTyxHQUFHLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztBQUNwQyxDQUFDO0FBTEQsZ0NBS0M7QUFFRCxTQUFTLE1BQU0sQ0FBQyxPQUFlLEVBQUUsSUFBb0I7SUFBcEIscUJBQUEsRUFBQSxTQUFvQjtJQUNuRCxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUEsa0JBQUksRUFBQyxtQkFBUyxFQUFFLG1CQUFtQixDQUFDLENBQUM7SUFDakQsSUFBSSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3BDLElBQU0sTUFBTSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3pDLGlEQUFpRDtJQUNqRCxPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDO0FBRUQsSUFBTSxVQUFVLEdBQUc7SUFDakIsR0FBRyxLQUFBO0lBQ0gsT0FBTyxTQUFBO0lBQ1AsVUFBVSxFQUFFLFVBQVU7SUFDdEIsY0FBYyxFQUFFLEdBQUcsQ0FBQyxjQUFjO0lBQ2xDLE9BQU8sRUFBRSxHQUFHLENBQUMsT0FBTztJQUNwQixNQUFNLEVBQUUsTUFBTTtJQUNkLFVBQVUsRUFBRSxHQUFHLENBQUMsVUFBVTtJQUMxQixTQUFTLEVBQUUsR0FBRyxDQUFDLFNBQVM7SUFDeEIsT0FBTyxFQUFFLEdBQUcsQ0FBQyxPQUFPO0lBQ3BCLElBQUksRUFBRSxHQUFHLENBQUMsSUFBSTtJQUNkLEtBQUssRUFBRSxHQUFHLENBQUMsS0FBSztJQUNoQixVQUFVLEVBQUUsR0FBRyxDQUFDLFVBQVU7SUFDMUIsVUFBVSxFQUFFLEdBQUcsQ0FBQyxVQUFVO0lBQzFCLGFBQWEsRUFBRSxHQUFHLENBQUMsYUFBYTtJQUNoQyxjQUFjLEVBQUUsR0FBRyxDQUFDLGNBQWM7SUFDbEMsU0FBUyxFQUFFLEdBQUcsQ0FBQyxTQUFTO0lBQ3hCLFdBQVcsRUFBRSxHQUFHLENBQUMsV0FBVztJQUM1QixRQUFRLEVBQUUsR0FBRyxDQUFDLFFBQVE7Q0FDdkIsQ0FBQztBQUVGLGtCQUFlLFVBQVUsQ0FBQyJ9