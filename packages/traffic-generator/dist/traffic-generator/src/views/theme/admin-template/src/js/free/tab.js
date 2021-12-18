"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../mdb/util/index");
const event_handler_1 = __importDefault(require("../mdb/dom/event-handler"));
const selector_engine_1 = __importDefault(require("../mdb/dom/selector-engine"));
const tab_1 = __importDefault(require("../bootstrap/mdb-prefix/tab"));
/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */
const NAME = 'tab';
const DATA_KEY = `mdb.${NAME}`;
const EVENT_KEY = `.${DATA_KEY}`;
const EVENT_SHOW_BS = 'show.bs.tab';
const EVENT_SHOWN_BS = 'shown.bs.tab';
const EVENT_HIDE_BS = 'hide.bs.tab';
const EVENT_HIDDEN_BS = 'hidden.bs.tab';
const EVENT_SHOW = `show${EVENT_KEY}`;
const EVENT_SHOWN = `shown${EVENT_KEY}`;
const EVENT_HIDE = `hide${EVENT_KEY}`;
const EVENT_HIDDEN = `hidden${EVENT_KEY}`;
const CLASS_NAME_ACTIVE = 'active';
const CLASS_NAME_DISABLED = 'disabled';
const SELECTOR_NAV_LIST_GROUP = '.nav, .list-group';
const SELECTOR_ACTIVE = '.active';
const SELECTOR_ACTIVE_UL = ':scope > li > .active';
const SELECTOR_DATA_TOGGLE = '[data-mdb-toggle="tab"], [data-mdb-toggle="pill"], [data-mdb-toggle="list"]';
class Tab extends tab_1.default {
    constructor(element) {
        super(element);
        this._previous = null;
        this._init();
    }
    dispose() {
        event_handler_1.default.off(this._element, EVENT_SHOW_BS);
        event_handler_1.default.off(this._element, EVENT_SHOWN_BS);
        super.dispose();
    }
    // Getters
    static get NAME() {
        return NAME;
    }
    // Override
    show() {
        if ((this._element.parentNode &&
            this._element.parentNode.nodeType === Node.ELEMENT_NODE &&
            this._element.classList.contains(CLASS_NAME_ACTIVE)) ||
            this._element.classList.contains(CLASS_NAME_DISABLED)) {
            return;
        }
        const target = (0, index_1.getElementFromSelector)(this._element);
        const listElement = this._element.closest(SELECTOR_NAV_LIST_GROUP);
        if (listElement) {
            const itemSelector = listElement.nodeName === 'UL' || listElement.nodeName === 'OL'
                ? SELECTOR_ACTIVE_UL
                : SELECTOR_ACTIVE;
            this._previous = selector_engine_1.default.find(itemSelector, listElement);
            this._previous = this._previous[this._previous.length - 1];
        }
        let hideEvent = null;
        let hideEventMdb = null;
        if (this._previous) {
            hideEvent = event_handler_1.default.trigger(this._previous, EVENT_HIDE_BS, {
                relatedTarget: this._element,
            });
            hideEventMdb = event_handler_1.default.trigger(this._previous, EVENT_HIDE, {
                relatedTarget: this._element,
            });
        }
        const showEvent = event_handler_1.default.trigger(this._element, EVENT_SHOW_BS, {
            relatedTarget: this._previous,
        });
        if (showEvent.defaultPrevented ||
            (hideEvent !== null && hideEvent.defaultPrevented) ||
            (hideEventMdb !== null && hideEventMdb.defaultPrevented)) {
            return;
        }
        this._activate(this._element, listElement);
        const complete = () => {
            event_handler_1.default.trigger(this._previous, EVENT_HIDDEN_BS, {
                relatedTarget: this._element,
            });
            event_handler_1.default.trigger(this._previous, EVENT_HIDDEN, {
                relatedTarget: this._element,
            });
            event_handler_1.default.trigger(this._element, EVENT_SHOWN_BS, {
                relatedTarget: this._previous,
            });
        };
        if (target) {
            this._activate(target, target.parentNode, complete);
        }
        else {
            complete();
        }
    }
    // Private
    _init() {
        this._bindShowEvent();
        this._bindShownEvent();
        this._bindHideEvent();
        this._bindHiddenEvent();
    }
    _bindShowEvent() {
        event_handler_1.default.on(this._element, EVENT_SHOW_BS, (e) => {
            event_handler_1.default.trigger(this._element, EVENT_SHOW, {
                relatedTarget: e.relatedTarget,
            });
        });
    }
    _bindShownEvent() {
        event_handler_1.default.on(this._element, EVENT_SHOWN_BS, (e) => {
            event_handler_1.default.trigger(this._element, EVENT_SHOWN, {
                relatedTarget: e.relatedTarget,
            });
        });
    }
    _bindHideEvent() {
        event_handler_1.default.on(this._previous, EVENT_HIDE_BS, () => {
            event_handler_1.default.trigger(this._previous, EVENT_HIDE);
        });
    }
    _bindHiddenEvent() {
        event_handler_1.default.on(this._previous, EVENT_HIDDEN_BS, () => {
            event_handler_1.default.trigger(this._previous, EVENT_HIDDEN);
        });
    }
}
/**
 * ------------------------------------------------------------------------
 * Data Api implementation - auto initialization
 * ------------------------------------------------------------------------
 */
selector_engine_1.default.find(SELECTOR_DATA_TOGGLE).forEach((el) => {
    let instance = Tab.getInstance(el);
    if (!instance) {
        instance = new Tab(el);
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
        $.fn[NAME] = Tab.jQueryInterface;
        $.fn[NAME].Constructor = Tab;
        $.fn[NAME].noConflict = () => {
            $.fn[NAME] = JQUERY_NO_CONFLICT;
            return Tab.jQueryInterface;
        };
    }
});
exports.default = Tab;
//# sourceMappingURL=tab.js.map