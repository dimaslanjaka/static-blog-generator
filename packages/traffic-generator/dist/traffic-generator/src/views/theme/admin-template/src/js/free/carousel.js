"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../mdb/util/index");
const event_handler_1 = __importDefault(require("../mdb/dom/event-handler"));
const selector_engine_1 = __importDefault(require("../mdb/dom/selector-engine"));
const carousel_1 = __importDefault(require("../bootstrap/mdb-prefix/carousel"));
/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */
const NAME = 'carousel';
const DATA_KEY = `mdb.${NAME}`;
const EVENT_KEY = `.${DATA_KEY}`;
const EVENT_SLIDE_BS = 'slide.bs.carousel';
const EVENT_SLID_BS = 'slid.bs.carousel';
const EVENT_SLIDE = `slide${EVENT_KEY}`;
const EVENT_SLID = `slid${EVENT_KEY}`;
const SELECTOR_DATA_RIDE = '[data-mdb-ride="carousel"]';
class Carousel extends carousel_1.default {
    constructor(element, data) {
        super(element, data);
        this._init();
    }
    dispose() {
        event_handler_1.default.off(this._element, EVENT_SLIDE_BS);
        event_handler_1.default.off(this._element, EVENT_SLID_BS);
        super.dispose();
    }
    // Getters
    static get NAME() {
        return NAME;
    }
    // Private
    _init() {
        this._bindSlideEvent();
        this._bindSlidEvent();
    }
    _bindSlideEvent() {
        event_handler_1.default.on(this._element, EVENT_SLIDE_BS, (e) => {
            event_handler_1.default.trigger(this._element, EVENT_SLIDE, {
                relatedTarget: e.relatedTarget,
                direction: e.direction,
                from: e.from,
                to: e.to,
            });
        });
    }
    _bindSlidEvent() {
        event_handler_1.default.on(this._element, EVENT_SLID_BS, (e) => {
            event_handler_1.default.trigger(this._element, EVENT_SLID, {
                relatedTarget: e.relatedTarget,
                direction: e.direction,
                from: e.from,
                to: e.to,
            });
        });
    }
}
/**
 * ------------------------------------------------------------------------
 * Data Api implementation - auto initialization
 * ------------------------------------------------------------------------
 */
selector_engine_1.default.find(SELECTOR_DATA_RIDE).forEach((el) => {
    let instance = Carousel.getInstance(el);
    if (!instance) {
        instance = new Carousel(el);
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
        $.fn[NAME] = Carousel.jQueryInterface;
        $.fn[NAME].Constructor = Carousel;
        $.fn[NAME].noConflict = () => {
            $.fn[NAME] = JQUERY_NO_CONFLICT;
            return Carousel.jQueryInterface;
        };
    }
});
exports.default = Carousel;
//# sourceMappingURL=carousel.js.map