"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsdom_1 = require("jsdom");
class jdom {
    constructor() {
        this.instances = {};
        this.parse = (str) => {
            this.instance = new jsdom_1.JSDOM(str);
            const document = this.instance.window.document;
            return document;
        };
    }
    close() {
        this.instance.window.close();
    }
    serialize() {
        const result = this.instance.serialize();
        this.close();
        return result;
    }
    body() {
        const doc = this.instance.window.document;
        return doc.body;
    }
    toString() {
        const result = this.instance.window.document.documentElement.outerHTML;
        this.close();
        return result;
    }
}
exports.default = jdom;
//# sourceMappingURL=jsdom.js.map