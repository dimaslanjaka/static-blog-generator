"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsdom_1 = require("jsdom");
function default_1(html) {
    var dom = new jsdom_1.JSDOM(html);
    var pretext = dom.window.document.querySelectorAll('pre,code'); // NodeListOf<Element>
    pretext.forEach(function (el) {
        if (!el.classList.contains('notranslate'))
            el.classList.add('notranslate');
    });
    var content = dom.window.document.querySelector('body').innerHTML;
    dom.window.close();
    return content;
}
exports.default = default_1;
//# sourceMappingURL=notranslate.js.map