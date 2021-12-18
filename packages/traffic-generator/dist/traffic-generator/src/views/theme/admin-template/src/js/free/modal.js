"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../mdb/util/index");
const event_handler_1 = __importDefault(require("../mdb/dom/event-handler"));
const selector_engine_1 = __importDefault(require("../mdb/dom/selector-engine"));
const modal_1 = __importDefault(require("../bootstrap/mdb-prefix/modal"));
/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */
const NAME = 'modal';
const DATA_KEY = `mdb.${NAME}`;
const EVENT_KEY = `.${DATA_KEY}`;
const EVENT_HIDE_BS = 'hide.bs.modal';
const EVENT_HIDE_PREVENTED_BS = 'hidePrevented.bs.modal';
const EVENT_HIDDEN_BS = 'hidden.bs.modal';
const EVENT_SHOW_BS = 'show.bs.modal';
const EVENT_SHOWN_BS = 'shown.bs.modal';
const EVENT_HIDE = `hide${EVENT_KEY}`;
const EVENT_HIDE_PREVENTED = `hidePrevented${EVENT_KEY}`;
const EVENT_HIDDEN = `hidden${EVENT_KEY}`;
const EVENT_SHOW = `show${EVENT_KEY}`;
const EVENT_SHOWN = `shown${EVENT_KEY}`;
const SELECTOR_DATA_TOGGLE = '[data-mdb-toggle="modal"]';
class Modal extends modal_1.default {
    constructor(element, data) {
        super(element, data);
        this._init();
    }
    dispose() {
        event_handler_1.default.off(this._element, EVENT_SHOW_BS);
        event_handler_1.default.off(this._element, EVENT_SHOWN_BS);
        event_handler_1.default.off(this._element, EVENT_HIDE_BS);
        event_handler_1.default.off(this._element, EVENT_HIDDEN_BS);
        event_handler_1.default.off(this._element, EVENT_HIDE_PREVENTED_BS);
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
        this._bindHidePreventedEvent();
    }
    _bindShowEvent() {
        event_handler_1.default.on(this._element, EVENT_SHOW_BS, (e) => {
            event_handler_1.default.trigger(this._element, EVENT_SHOW, { relatedTarget: e.relatedTarget });
        });
    }
    _bindShownEvent() {
        event_handler_1.default.on(this._element, EVENT_SHOWN_BS, (e) => {
            event_handler_1.default.trigger(this._element, EVENT_SHOWN, { relatedTarget: e.relatedTarget });
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
    _bindHidePreventedEvent() {
        event_handler_1.default.on(this._element, EVENT_HIDE_PREVENTED_BS, () => {
            event_handler_1.default.trigger(this._element, EVENT_HIDE_PREVENTED);
        });
    }
}
/**
 * ------------------------------------------------------------------------
 * Data Api implementation - auto initialization
 * ------------------------------------------------------------------------
 */
selector_engine_1.default.find(SELECTOR_DATA_TOGGLE).forEach((el) => {
    const selector = (0, index_1.getSelectorFromElement)(el);
    const selectorElement = selector_engine_1.default.findOne(selector);
    let instance = Modal.getInstance(selectorElement);
    if (!instance) {
        instance = new Modal(selectorElement);
    }
});
/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 * add .modal to jQuery only if jQuery is present
 */
(0, index_1.onDOMContentLoaded)(() => {
    const $ = (0, index_1.getjQuery)();
    if ($) {
        const JQUERY_NO_CONFLICT = $.fn[NAME];
        $.fn[NAME] = Modal.jQueryInterface;
        $.fn[NAME].Constructor = Modal;
        $.fn[NAME].noConflict = () => {
            $.fn[NAME] = JQUERY_NO_CONFLICT;
            return Modal.jQueryInterface;
        };
    }
});
exports.default = Modal;
//# sourceMappingURL=modal.js.map