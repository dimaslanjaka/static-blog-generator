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
var _config_1 = require("../../types/_config");
var helpers_1 = require("../helpers");
Object.defineProperty(exports, "helpers", { enumerable: true, get: function () { return helpers_1.helpers; } });
function renderFile(file, opts) {
    if (opts === void 0) { opts = {}; }
    //opts._ = helpers;
    opts.root = (0, filemanager_1.join)(_config_1.theme_dir, 'layout/layout.ejs');
    opts = Object.assign(helpers_1.helpers, opts);
    return ejs.renderFile(file, opts);
}
exports.renderFile = renderFile;
function render(content, opts) {
    if (opts === void 0) { opts = {}; }
    opts.root = (0, filemanager_1.join)(_config_1.theme_dir, 'layout/layout.ejs');
    opts = Object.assign(helpers_1.helpers, opts);
    var render = ejs.render(content, opts);
    //if (opts.async) return Promise.resolve(render);
    return render;
}
var ejs_object = {
    ejs: ejs,
    helpers: helpers_1.helpers,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJzcmMvcmVuZGVyZXIvZWpzL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsc0VBQXNFO0FBQ3RFLHVDQUEyQjtBQUMzQixzREFBOEM7QUFHOUMsK0NBQWtFO0FBQ2xFLHNDQUFxQztBQThDNUIsd0ZBOUNBLGlCQUFPLE9BOENBO0FBckNoQixTQUFnQixVQUFVLENBQUMsSUFBWSxFQUFFLElBQW9CO0lBQXBCLHFCQUFBLEVBQUEsU0FBb0I7SUFDM0QsbUJBQW1CO0lBQ25CLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBQSxrQkFBSSxFQUFDLG1CQUFTLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztJQUNqRCxJQUFJLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxpQkFBTyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3BDLE9BQU8sR0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDcEMsQ0FBQztBQUxELGdDQUtDO0FBRUQsU0FBUyxNQUFNLENBQUMsT0FBZSxFQUFFLElBQW9CO0lBQXBCLHFCQUFBLEVBQUEsU0FBb0I7SUFDbkQsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFBLGtCQUFJLEVBQUMsbUJBQVMsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO0lBQ2pELElBQUksR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLGlCQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDcEMsSUFBTSxNQUFNLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDekMsaURBQWlEO0lBQ2pELE9BQU8sTUFBTSxDQUFDO0FBQ2hCLENBQUM7QUFFRCxJQUFNLFVBQVUsR0FBRztJQUNqQixHQUFHLEtBQUE7SUFDSCxPQUFPLG1CQUFBO0lBQ1AsVUFBVSxFQUFFLFVBQVU7SUFDdEIsY0FBYyxFQUFFLEdBQUcsQ0FBQyxjQUFjO0lBQ2xDLE9BQU8sRUFBRSxHQUFHLENBQUMsT0FBTztJQUNwQixNQUFNLEVBQUUsTUFBTTtJQUNkLFVBQVUsRUFBRSxHQUFHLENBQUMsVUFBVTtJQUMxQixTQUFTLEVBQUUsR0FBRyxDQUFDLFNBQVM7SUFDeEIsT0FBTyxFQUFFLEdBQUcsQ0FBQyxPQUFPO0lBQ3BCLElBQUksRUFBRSxHQUFHLENBQUMsSUFBSTtJQUNkLEtBQUssRUFBRSxHQUFHLENBQUMsS0FBSztJQUNoQixVQUFVLEVBQUUsR0FBRyxDQUFDLFVBQVU7SUFDMUIsVUFBVSxFQUFFLEdBQUcsQ0FBQyxVQUFVO0lBQzFCLGFBQWEsRUFBRSxHQUFHLENBQUMsYUFBYTtJQUNoQyxjQUFjLEVBQUUsR0FBRyxDQUFDLGNBQWM7SUFDbEMsU0FBUyxFQUFFLEdBQUcsQ0FBQyxTQUFTO0lBQ3hCLFdBQVcsRUFBRSxHQUFHLENBQUMsV0FBVztJQUM1QixRQUFRLEVBQUUsR0FBRyxDQUFDLFFBQVE7Q0FDdkIsQ0FBQztBQUVGLGtCQUFlLFVBQVUsQ0FBQyJ9