"use strict";
/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.0.0-beta2): base-component.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const data_1 = __importDefault(require("./dom/data"));
/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */
const VERSION = '5.0.0-beta2';
class BaseComponent {
    constructor(element) {
        if (!element) {
            return;
        }
        this._element = element;
        data_1.default.setData(element, this.constructor.DATA_KEY, this);
    }
    dispose() {
        data_1.default.removeData(this._element, this.constructor.DATA_KEY);
        this._element = null;
    }
    /** Static */
    static getInstance(element) {
        return data_1.default.getData(element, this.DATA_KEY);
    }
    static get VERSION() {
        return VERSION;
    }
}
exports.default = BaseComponent;
//# sourceMappingURL=base-component.js.map