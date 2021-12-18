"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../mdb/util/index");
const event_handler_1 = __importDefault(require("../mdb/dom/event-handler"));
const selector_engine_1 = __importDefault(require("../mdb/dom/selector-engine"));
const manipulator_1 = __importDefault(require("../mdb/dom/manipulator"));
const scrollspy_1 = __importDefault(require("../bootstrap/mdb-prefix/scrollspy"));
/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */
const NAME = 'scrollspy';
const DATA_KEY = `mdb.${NAME}`;
const EVENT_KEY = `.${DATA_KEY}`;
const DATA_API_KEY = '.data-api';
const EVENT_ACTIVATE_BS = 'activate.bs.scrollspy';
const EVENT_ACTIVATE = `activate${EVENT_KEY}`;
const SELECTOR_DATA_SPY = '[data-mdb-spy="scroll"]';
const EVENT_LOAD_DATA_API = `load${EVENT_KEY}${DATA_API_KEY}`;
class ScrollSpy extends scrollspy_1.default {
    constructor(element, data) {
        super(element, data);
        this._scrollElement = element.tagName === 'BODY' ? window : element;
        this._init();
    }
    dispose() {
        event_handler_1.default.off(this._scrollElement, EVENT_ACTIVATE_BS);
        this._scrollElement = null;
        super.dispose();
    }
    // Getters
    static get NAME() {
        return NAME;
    }
    // Private
    _init() {
        this._bindActivateEvent();
    }
    _bindActivateEvent() {
        event_handler_1.default.on(this._scrollElement, EVENT_ACTIVATE_BS, (e) => {
            event_handler_1.default.trigger(this._scrollElement, EVENT_ACTIVATE, {
                relatedTarget: e.relatedTarget,
            });
        });
    }
}
/**
 * ------------------------------------------------------------------------
 * Data Api implementation - auto initialization
 * ------------------------------------------------------------------------
 */
event_handler_1.default.on(window, EVENT_LOAD_DATA_API, () => {
    selector_engine_1.default.find(SELECTOR_DATA_SPY).forEach((el) => {
        let instance = ScrollSpy.getInstance(el);
        if (!instance) {
            instance = new ScrollSpy(el, manipulator_1.default.getDataAttributes(el));
        }
    });
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
        $.fn[NAME] = ScrollSpy.jQueryInterface;
        $.fn[NAME].Constructor = ScrollSpy;
        $.fn[NAME].noConflict = () => {
            $.fn[NAME] = JQUERY_NO_CONFLICT;
            return ScrollSpy.jQueryInterface;
        };
    }
});
exports.default = ScrollSpy;
//# sourceMappingURL=scrollspy.js.map