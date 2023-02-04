"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEntries = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const jsdom_1 = __importDefault(require("jsdom"));
const path_1 = __importDefault(require("path"));
const sbg_utility_1 = __importDefault(require("sbg-utility"));
function createEntries(xmlFile) {
    const xmlStr = fs_extra_1.default.readFileSync(xmlFile).toString();
    // Create empty DOM, the input param here is for HTML not XML, and we don want to parse HTML
    const dom = new jsdom_1.default.JSDOM();
    // Get DOMParser, same API as in browser
    const DOMParser = dom.window.DOMParser;
    const parser = new DOMParser();
    // Create document by parsing XML
    const document = parser.parseFromString(xmlStr, 'text/xml');
    // save the xml after modifications
    const xmlString = document.documentElement.outerHTML;
    const entries = document.documentElement.getElementsByTagName('entry');
    sbg_utility_1.default.writefile(path_1.default.join(process.cwd(), `tmp/sbg-cli/${path_1.default.basename(xmlFile)}-rss.xml`), xmlString);
    sbg_utility_1.default.writefile(path_1.default.join(process.cwd(), `tmp/sbg-cli/${path_1.default.basename(xmlFile)}-inner.xml`), document.documentElement.innerHTML);
    sbg_utility_1.default.writefile(path_1.default.join(process.cwd(), `tmp/sbg-cli/${path_1.default.basename(xmlFile)}-entry.xml`), entries[0].innerHTML);
    return {
        dom,
        window: dom.window,
        document
    };
}
exports.createEntries = createEntries;
//# sourceMappingURL=createEntries.js.map