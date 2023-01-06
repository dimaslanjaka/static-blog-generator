"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsdom_1 = require("jsdom");
var jdom = (function () {
    function jdom() {
        var _this = this;
        this.instances = {};
        this.parse = function (str) {
            _this.instance = new jsdom_1.JSDOM(str);
            var document = _this.instance.window.document;
            return document;
        };
    }
    jdom.prototype.close = function () {
        this.instance.window.close();
    };
    jdom.prototype.serialize = function () {
        var result = this.instance.serialize();
        this.close();
        return result;
    };
    jdom.prototype.body = function () {
        var doc = this.instance.window.document;
        return doc.body;
    };
    jdom.prototype.toString = function () {
        var result = this.instance.window.document.documentElement.outerHTML;
        this.close();
        return result;
    };
    return jdom;
}());
exports.default = jdom;
