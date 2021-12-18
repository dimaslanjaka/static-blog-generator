"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../mdb/util/index");
const event_handler_1 = __importDefault(require("../mdb/dom/event-handler"));
const tooltip_1 = __importDefault(require("../bootstrap/mdb-prefix/tooltip"));
const selector_engine_1 = __importDefault(require("../mdb/dom/selector-engine"));
/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */
const NAME = 'tooltip';
const DATA_KEY = `mdb.${NAME}`;
const EVENT_KEY = `.${DATA_KEY}`;
const EVENT_HIDE_BS = 'hide.bs.tooltip';
const EVENT_HIDDEN_BS = 'hidden.bs.tooltip';
const EVENT_SHOW_BS = 'show.bs.tooltip';
const EVENT_SHOWN_BS = 'shown.bs.tooltip';
const EVENT_INSERTED_BS = 'inserted.bs.tooltip';
const EVENT_HIDE = `hide${EVENT_KEY}`;
const EVENT_HIDDEN = `hidden${EVENT_KEY}`;
const EVENT_SHOW = `show${EVENT_KEY}`;
const EVENT_SHOWN = `shown${EVENT_KEY}`;
const EVENT_INSERTED = `inserted${EVENT_KEY}`;
const SELECTOR_DATA_TOGGLE = '[data-mdb-toggle="tooltip"]';
class Tooltip extends tooltip_1.default {
    constructor(element, data) {
        super(element, data);
        this._init();
    }
    dispose() {
        event_handler_1.default.off(this._element, EVENT_SHOW_BS);
        event_handler_1.default.off(this._element, EVENT_SHOWN_BS);
        event_handler_1.default.off(this._element, EVENT_HIDE_BS);
        event_handler_1.default.off(this._element, EVENT_HIDDEN_BS);
        event_handler_1.default.off(this._element, EVENT_INSERTED_BS);
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
        event_handler_1.default.on(this.element, EVENT_SHOW_BS, () => {
            event_handler_1.default.trigger(this.element, EVENT_SHOW);
        });
    }
    _bindShownEvent() {
        event_handler_1.default.on(this.element, EVENT_SHOWN_BS, () => {
            event_handler_1.default.trigger(this.element, EVENT_SHOWN);
        });
    }
    _bindHideEvent() {
        event_handler_1.default.on(this.element, EVENT_HIDE_BS, () => {
            event_handler_1.default.trigger(this.element, EVENT_HIDE);
        });
    }
    _bindHiddenEvent() {
        event_handler_1.default.on(this.element, EVENT_HIDDEN_BS, () => {
            event_handler_1.default.trigger(this.element, EVENT_HIDDEN);
        });
    }
    _bindHidePreventedEvent() {
        event_handler_1.default.on(this.element, EVENT_INSERTED_BS, () => {
            event_handler_1.default.trigger(this.element, EVENT_INSERTED);
        });
    }
}
/**
 * ------------------------------------------------------------------------
 * Data Api implementation - auto initialization
 * ------------------------------------------------------------------------
 */
selector_engine_1.default.find(SELECTOR_DATA_TOGGLE).forEach((el) => {
    let instance = Tooltip.getInstance(el);
    if (!instance) {
        instance = new Tooltip(el);
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
        $.fn[NAME] = Tooltip.jQueryInterface;
        $.fn[NAME].Constructor = Tooltip;
        $.fn[NAME].noConflict = () => {
            $.fn[NAME] = JQUERY_NO_CONFLICT;
            return Tooltip.jQueryInterface;
        };
    }
});
exports.default = Tooltip;
//# sourceMappingURL=tooltip.js.map