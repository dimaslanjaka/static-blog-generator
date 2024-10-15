// sbg-cli v2.0.0 Copyright (c) 2024 Dimas Lanjaka <dimaslanjaka@gmail.com> (https://webmanajemen.com)
import fs from 'fs-extra';
import jsdom from 'jsdom';
import path from 'path';
import utility__default from 'sbg-utility';

function createEntries(xmlFile) {
    const xmlStr = fs.readFileSync(xmlFile).toString();
    // Create empty DOM, the input param here is for HTML not XML, and we don want to parse HTML
    const dom = new jsdom.JSDOM();
    // Get DOMParser, same API as in browser
    const DOMParser = dom.window.DOMParser;
    const parser = new DOMParser();
    // Create document by parsing XML
    const document = parser.parseFromString(xmlStr, 'text/xml');
    // save the xml after modifications
    const xmlString = document.documentElement.outerHTML;
    const entries = document.documentElement.getElementsByTagName('entry');
    utility__default.writefile(path.join(process.cwd(), `tmp/sbg-cli/${path.basename(xmlFile)}-rss.xml`), xmlString);
    utility__default.writefile(path.join(process.cwd(), `tmp/sbg-cli/${path.basename(xmlFile)}-inner.xml`), document.documentElement.innerHTML);
    utility__default.writefile(path.join(process.cwd(), `tmp/sbg-cli/${path.basename(xmlFile)}-entry.xml`), entries[0].innerHTML);
    return {
        dom,
        window: dom.window,
        document
    };
}

export { createEntries };
