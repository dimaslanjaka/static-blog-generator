"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.helpers = exports.EJSRenderString = exports.EJSRenderFile = void 0;
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
var ejs = __importStar(require("ejs"));
var filemanager_1 = require("../../node/filemanager");
var _config_1 = require("../../types/_config");
var helpers_1 = require("../helpers");
Object.defineProperty(exports, "helpers", { enumerable: true, get: function () { return helpers_1.helpers; } });
function EJSRenderFile(file, opts) {
    if (opts === void 0) { opts = {}; }
    //opts._ = helpers;
    opts.root = (0, filemanager_1.join)(_config_1.theme_dir, 'layout/layout.ejs');
    opts = Object.assign(helpers_1.helpers, opts);
    return ejs.renderFile(file, opts);
}
exports.EJSRenderFile = EJSRenderFile;
function EJSRenderString(content, opts) {
    if (opts === void 0) { opts = {}; }
    opts.root = (0, filemanager_1.join)(_config_1.theme_dir, 'layout/layout.ejs');
    opts = Object.assign(helpers_1.helpers, opts);
    var render = ejs.render(content, opts);
    //if (opts.async) return Promise.resolve(render);
    return render;
}
exports.EJSRenderString = EJSRenderString;
var ejs_object = __assign(__assign({ ejs: ejs }, helpers_1.helpers), { renderFile: EJSRenderFile, resolveInclude: ejs.resolveInclude, compile: ejs.compile, render: EJSRenderString, clearCache: ejs.clearCache, escapeXML: ejs.escapeXML, VERSION: ejs.VERSION, name: ejs.name, cache: ejs.cache, fileLoader: ejs.fileLoader, localsName: ejs.localsName, openDelimiter: ejs.openDelimiter, closeDelimiter: ejs.closeDelimiter, delimiter: ejs.delimiter, promiseImpl: ejs.promiseImpl, Template: ejs.Template });
exports.default = ejs_object;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJzcmMvcmVuZGVyZXIvZWpzL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxzRUFBc0U7QUFDdEUsdUNBQTJCO0FBQzNCLHNEQUE4QztBQUc5QywrQ0FBa0U7QUFDbEUsc0NBQXFDO0FBOEM1Qix3RkE5Q0EsaUJBQU8sT0E4Q0E7QUFyQ2hCLFNBQWdCLGFBQWEsQ0FBQyxJQUFZLEVBQUUsSUFBb0I7SUFBcEIscUJBQUEsRUFBQSxTQUFvQjtJQUM5RCxtQkFBbUI7SUFDbkIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFBLGtCQUFJLEVBQUMsbUJBQVMsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO0lBQ2pELElBQUksR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLGlCQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDcEMsT0FBTyxHQUFHLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztBQUNwQyxDQUFDO0FBTEQsc0NBS0M7QUFFRCxTQUFnQixlQUFlLENBQUMsT0FBZSxFQUFFLElBQW9CO0lBQXBCLHFCQUFBLEVBQUEsU0FBb0I7SUFDbkUsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFBLGtCQUFJLEVBQUMsbUJBQVMsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO0lBQ2pELElBQUksR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLGlCQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDcEMsSUFBTSxNQUFNLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDekMsaURBQWlEO0lBQ2pELE9BQU8sTUFBTSxDQUFDO0FBQ2hCLENBQUM7QUFORCwwQ0FNQztBQUVELElBQU0sVUFBVSx1QkFDZCxHQUFHLEtBQUEsSUFDQSxpQkFBTyxLQUNWLFVBQVUsRUFBRSxhQUFhLEVBQ3pCLGNBQWMsRUFBRSxHQUFHLENBQUMsY0FBYyxFQUNsQyxPQUFPLEVBQUUsR0FBRyxDQUFDLE9BQU8sRUFDcEIsTUFBTSxFQUFFLGVBQWUsRUFDdkIsVUFBVSxFQUFFLEdBQUcsQ0FBQyxVQUFVLEVBQzFCLFNBQVMsRUFBRSxHQUFHLENBQUMsU0FBUyxFQUN4QixPQUFPLEVBQUUsR0FBRyxDQUFDLE9BQU8sRUFDcEIsSUFBSSxFQUFFLEdBQUcsQ0FBQyxJQUFJLEVBQ2QsS0FBSyxFQUFFLEdBQUcsQ0FBQyxLQUFLLEVBQ2hCLFVBQVUsRUFBRSxHQUFHLENBQUMsVUFBVSxFQUMxQixVQUFVLEVBQUUsR0FBRyxDQUFDLFVBQVUsRUFDMUIsYUFBYSxFQUFFLEdBQUcsQ0FBQyxhQUFhLEVBQ2hDLGNBQWMsRUFBRSxHQUFHLENBQUMsY0FBYyxFQUNsQyxTQUFTLEVBQUUsR0FBRyxDQUFDLFNBQVMsRUFDeEIsV0FBVyxFQUFFLEdBQUcsQ0FBQyxXQUFXLEVBQzVCLFFBQVEsRUFBRSxHQUFHLENBQUMsUUFBUSxHQUN2QixDQUFDO0FBRUYsa0JBQWUsVUFBVSxDQUFDIn0=