// sbg-cli v2.0.0 Copyright (c) 2024 Dimas Lanjaka <dimaslanjaka@gmail.com> (https://webmanajemen.com)
'use strict';

var fs = require('fs-extra');
var he = require('he');
var jsonc = require('jsonc-parser');
var utility = require('sbg-utility');
var upath = require('../../../_virtual/upath.cjs');
var url = require('url');
var xml2js = require('xml2js');
var config = require('./config.cjs');

var _documentCurrentScript = typeof document !== 'undefined' ? document.currentScript : null;
const __filename$1 = url.fileURLToPath((typeof document === 'undefined' ? require('u' + 'rl').pathToFileURL(__filename).href : (_documentCurrentScript && _documentCurrentScript.tagName.toUpperCase() === 'SCRIPT' && _documentCurrentScript.src || new URL('src/import/blogger/parseEntries.cjs', document.baseURI).href)));
const __dirname$1 = upath.default.dirname(__filename$1);
const excludeTitleArr = jsonc.parse(fs.readFileSync(upath.default.join(__dirname$1, 'excludeTitle.json')).toString());
async function parseEntries(c) {
    const feeds = c.document.documentElement.getElementsByTagName('entry');
    for (let index = 0; index < feeds.length; index++) {
        const element = feeds[index];
        let title = element.getElementsByTagName('title')[0].innerHTML;
        const excludeTitle = excludeTitleArr.map((title) => {
            return title.toLowerCase().trim();
        });
        // skip if contains default title
        if (excludeTitle.includes(title.toLowerCase().trim()))
            continue;
        /** CONTENT PROCESS START **/
        let content = element.getElementsByTagName('content')[0].innerHTML;
        content = he.decode(content);
        /** CONTENT PROCESS END **/
        // write post with decoded entities
        let obj = {
            entry: { content: '', id: [] }
        };
        //let decodedContent = he.decode(content);
        await new Promise((resolve, reject) => {
            xml2js.parseString(element.outerHTML, function (err, result) {
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
                utility.writefile(upath.default.join(config.entriesDir, utility.slugify(title) + '.json'), JSON.stringify(obj, null, 2));
                resolve(null);
            });
        });
    }
    return c;
}

exports.parseEntries = parseEntries;
