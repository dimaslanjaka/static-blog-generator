"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseEntries = void 0;
const he_1 = __importDefault(require("he"));
const sbg_utility_1 = require("sbg-utility");
const upath_1 = __importDefault(require("upath"));
const xml2js_1 = __importDefault(require("xml2js"));
const config_1 = require("./config");
const excludeTitle_json_1 = __importDefault(require("./excludeTitle.json"));
async function parseEntries(c) {
    const feeds = c.document.documentElement.getElementsByTagName('entry');
    for (let index = 0; index < feeds.length; index++) {
        const element = feeds[index];
        let title = element.getElementsByTagName('title')[0].innerHTML;
        const excludeTitle = excludeTitle_json_1.default.map((title) => {
            return title.toLowerCase().trim();
        });
        // skip if contains default title
        if (excludeTitle.includes(title.toLowerCase().trim()))
            continue;
        /** CONTENT PROCESS START **/
        let content = element.getElementsByTagName('content')[0].innerHTML;
        content = he_1.default.decode(content);
        /** CONTENT PROCESS END **/
        // write post with decoded entities
        let obj = {
            entry: { content: '', id: [] }
        };
        //let decodedContent = he.decode(content);
        await new Promise((resolve, reject) => {
            xml2js_1.default.parseString(element.outerHTML, function (err, result) {
                if (err)
                    reject(err);
                obj = result;
                // fix title empty (might removed comment)
                if (title.trim().length === 0) {
                    title = obj.entry.id[0].replace('tag:blogger.com,1999:', '');
                }
                obj.entry.content = content;
                obj.entry.id[0] = obj.entry.id[0].replace('tag:blogger.com,1999:', '');
                //writeFileSync(path.join(this.entriesDir, sanitize(title) + ".xml"), element.outerHTML);
                (0, sbg_utility_1.writefile)(upath_1.default.join(config_1.entriesDir, (0, sbg_utility_1.slugify)(title) + '.json'), JSON.stringify(obj, null, 2));
                resolve(null);
            });
        });
    }
    return c;
}
exports.parseEntries = parseEntries;
//# sourceMappingURL=parseEntries.js.map