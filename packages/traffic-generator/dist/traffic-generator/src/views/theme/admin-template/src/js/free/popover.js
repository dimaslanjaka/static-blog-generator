"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../mdb/util/index");
const event_handler_1 = __importDefault(require("../mdb/dom/event-handler"));
const selector_engine_1 = __importDefault(require("../mdb/dom/selector-engine"));
const popover_1 = __importDefault(require("../bootstrap/mdb-prefix/popover"));
/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */
const NAME = 'popover';
const DATA_KEY = `mdb.${NAME}`;
const EVENT_KEY = `.${DATA_KEY}`;
const EVENT_SHOW_BS = 'show.bs.popover';
const EVENT_SHOWN_BS = 'shown.bs.popover';
const EVENT_HIDE_BS = 'hide.bs.popover';
const EVENT_HIDDEN_BS = 'hidden.bs.popover';
const EVENT_INSERTED_BS = 'inserted.bs.popover';
const EVENT_SHOW = `show${EVENT_KEY}`;
const EVENT_SHOWN = `shown${EVENT_KEY}`;
const EVENT_HIDE = `hide${EVENT_KEY}`;
const EVENT_HIDDEN = `hidden${EVENT_KEY}`;
const EVENT_INSERTED = `inserted${EVENT_KEY}`;
const SELECTOR_DATA_TOGGLE = '[data-mdb-toggle="popover"]';
class Popover extends popover_1.default {
    constructor(element, data) {
        super(element, data);
        this._init();
    }
    dispose() {
        event_handler_1.default.off(this.element, EVENT_SHOW_BS);
        event_handler_1.default.off(this.element, EVENT_SHOWN_BS);
        event_handler_1.default.off(this.element, EVENT_HIDE_BS);
        event_handler_1.default.off(this.element, EVENT_HIDDEN_BS);
        event_handler_1.default.off(this.element, EVENT_INSERTED_BS);
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
        this._bindInsertedEvent();
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
    _bindInsertedEvent() {
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
    let instance = Popover.getInstance(el);
    if (!instance) {
        instance = new Popover(el);
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
        $.fn[NAME] = Popover.jQueryInterface;
        $.fn[NAME].Constructor = Popover;
        $.fn[NAME].noConflict = () => {
            $.fn[NAME] = JQUERY_NO_CONFLICT;
            return Popover.jQueryInterface;
        };
    }
});
exports.default = Popover;
//# sourceMappingURL=popover.js.map