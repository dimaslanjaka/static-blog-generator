"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const touchUtil_1 = __importDefault(require("./touchUtil"));
const event_handler_1 = __importDefault(require("../../dom/event-handler"));
const DEFAULT_OPTIONS = {
    threshold: 10,
    direction: 'all',
};
class Swipe extends touchUtil_1.default {
    constructor(element, options) {
        super();
        this._element = element;
        this._startPosition = null;
        this._options = {
            ...DEFAULT_OPTIONS,
            ...options,
        };
    }
    handleTouchStart(e) {
        this._startPosition = this._getCoordinates(e);
    }
    handleTouchMove(e) {
        if (!this._startPosition)
            return;
        const position = this._getCoordinates(e);
        const displacement = {
            x: position.x - this._startPosition.x,
            y: position.y - this._startPosition.y,
        };
        const swipe = this._getDirection(displacement);
        if (this._options.direction === 'all') {
            if (swipe.y.value < this._options.threshold && swipe.x.value < this._options.threshold) {
                return;
            }
            const direction = swipe.y.value > swipe.x.value ? swipe.y.direction : swipe.x.direction;
            event_handler_1.default.trigger(this._element, `swipe${direction}`);
            event_handler_1.default.trigger(this._element, 'swipe', { direction });
            this._startPosition = null;
            return;
        }
        const axis = this._options.direction === 'left' || this._options === 'right' ? 'x' : 'y';
        if (swipe[axis].direction === this._options.direction &&
            swipe[axis].value > this._options.threshold) {
            event_handler_1.default.trigger(this._element, `swipe${swipe[axis].direction}`);
            this._startPosition = null;
        }
    }
    handleTouchEnd() {
        this._startPosition = null;
    }
}
exports.default = Swipe;
//# sourceMappingURL=swipe.js.map