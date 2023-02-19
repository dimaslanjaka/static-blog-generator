"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.checkIndexed = exports.submitSitemap = exports.getSiteList = void 0;
var googleapis_1 = require("googleapis");
var oauth2_1 = require("./oauth2");
var searchconsole = googleapis_1.google.searchconsole('v1');
/**
 * fetch site list from search console
 * @returns
 */
function getSiteList() {
    return __awaiter(this, void 0, void 0, function () {
        var client, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, oauth2_1.jwtAuthorize)()];
                case 1:
                    client = _a.sent();
                    googleapis_1.google.options({ auth: client });
                    return [4 /*yield*/, searchconsole.sites.list({})];
                case 2:
                    response = _a.sent();
                    return [2 /*return*/, response.data];
            }
        });
    });
}
exports.getSiteList = getSiteList;
/**
 * submit sitemap
 * @param siteUrl
 * @param feedpath
 * @returns
 */
function submitSitemap(siteUrl, feedpath) {
    return __awaiter(this, void 0, void 0, function () {
        var client, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, oauth2_1.jwtAuthorize)()];
                case 1:
                    client = _a.sent();
                    googleapis_1.google.options({ auth: client });
                    return [4 /*yield*/, searchconsole.sitemaps.submit({
                            feedpath: feedpath,
                            siteUrl: siteUrl
                        })];
                case 2:
                    res = _a.sent();
                    return [2 /*return*/, res.data];
            }
        });
    });
}
exports.submitSitemap = submitSitemap;
/**
 * check url already indexed or not from webmaster
 * @param inspectionUrl
 * @param siteUrl
 * @returns
 */
function checkIndexed(inspectionUrl, siteUrl) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function () {
        var client, resInspectURL;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, (0, oauth2_1.jwtAuthorize)()];
                case 1:
                    client = _d.sent();
                    googleapis_1.google.options({ auth: client });
                    return [4 /*yield*/, searchconsole.urlInspection.index.inspect({
                            requestBody: {
                                inspectionUrl: inspectionUrl,
                                siteUrl: siteUrl,
                                languageCode: 'en-US'
                                //inspectionUrl: 'https://www.webmanajemen.com/chimeraland/materials/pure-wood-essence.html',
                                //siteUrl: 'sc-domain:webmanajemen.com'
                            }
                        })];
                case 2:
                    resInspectURL = _d.sent();
                    return [2 /*return*/, !((_c = (_b = (_a = resInspectURL.data.inspectionResult) === null || _a === void 0 ? void 0 : _a.indexStatusResult) === null || _b === void 0 ? void 0 : _b.coverageState) === null || _c === void 0 ? void 0 : _c.includes('not indexed'))];
            }
        });
    });
}
exports.checkIndexed = checkIndexed;
// checkIndexed('https://www.webmanajemen.com/chimeraland/materials/pure-wood-essence.html', 'sc-domain:webmanajemen.com');
