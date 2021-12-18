"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../mdb/util/index");
const event_handler_1 = __importDefault(require("../mdb/dom/event-handler"));
const selector_engine_1 = __importDefault(require("../mdb/dom/selector-engine"));
const toast_1 = __importDefault(require("../bootstrap/mdb-prefix/toast"));
/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */
const NAME = 'toast';
const DATA_KEY = `mdb.${NAME}`;
const EVENT_KEY = `.${DATA_KEY}`;
const EVENT_SHOW_BS = 'show.bs.toast';
const EVENT_SHOWN_BS = 'shown.bs.toast';
const EVENT_HIDE_BS = 'hide.bs.toast';
const EVENT_HIDDEN_BS = 'hidden.bs.toast';
const EVENT_SHOW = `show${EVENT_KEY}`;
const EVENT_SHOWN = `shown${EVENT_KEY}`;
const EVENT_HIDE = `hide${EVENT_KEY}`;
const EVENT_HIDDEN = `hidden${EVENT_KEY}`;
const SELECTOR_TOAST = '.toast';
class Toast extends toast_1.default {
    constructor(element, data) {
        super(element, data);
        this._init();
    }
    dispose() {
        event_handler_1.default.off(this._element, EVENT_SHOW_BS);
        event_handler_1.default.off(this._element, EVENT_SHOWN_BS);
        event_handler_1.default.off(this._element, EVENT_HIDE_BS);
        event_handler_1.default.off(this._element, EVENT_HIDDEN_BS);
        super.dispose();
    }
    // Getters
    static get NAME() {
        return NAME;
    }
    // Private
    _init() {
        this._bindShowEvent();
        this._bindShownEvent();
        this._bindHideEvent();
        this._bindHiddenEvent();
    }
    _bindShowEvent() {
        event_handler_1.default.on(this._element, EVENT_SHOW_BS, () => {
            event_handler_1.default.trigger(this._element, EVENT_SHOW);
        });
    }
    _bindShownEvent() {
        event_handler_1.default.on(this._element, EVENT_SHOWN_BS, () => {
            event_handler_1.default.trigger(this._element, EVENT_SHOWN);
        });
    }
    _bindHideEvent() {
        event_handler_1.default.on(this._element, EVENT_HIDE_BS, () => {
            event_handler_1.default.trigger(this._element, EVENT_HIDE);
        });
    }
    _bindHiddenEvent() {
        event_handler_1.default.on(this._element, EVENT_HIDDEN_BS, () => {
            event_handler_1.default.trigger(this._element, EVENT_HIDDEN);
        });
    }
}
/**
 * ------------------------------------------------------------------------
 * Data Api implementation - auto initialization
 * ------------------------------------------------------------------------
 */
selector_engine_1.default.find(SELECTOR_TOAST).forEach((el) => {
    let instance = Toast.getInstance(el);
    if (!instance) {
        instance = new Toast(el);
    }
});
/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 * add .rating to jQuery only if jQuery is present
 */
(0, index_1.onDOMContentLoaded)(() => {
    const $ = (0, index_1.getjQuery)();
    if ($) {
        const JQUERY_NO_CONFLICT = $.fn[NAME];
        $.fn[NAME] = Toast.jQueryInterface;
        $.fn[NAME].Constructor = Toast;
        $.fn[NAME].noConflict = () => {
            $.fn[NAME] = JQUERY_NO_CONFLICT;
            return Toast.jQueryInterface;
        };
    }
});
exports.default = Toast;
//# sourceMappingURL=toast.js.map