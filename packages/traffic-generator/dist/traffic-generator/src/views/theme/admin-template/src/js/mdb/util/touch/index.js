"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swipe_1 = __importDefault(require("./swipe"));
class Touch {
    constructor(element, event = 'swipe', options = {}) {
        this._element = element;
        this._event = event;
        // events
        this.swipe = new swipe_1.default(element, options);
        // handlers
        this._touchStartHandler = this._handleTouchStart.bind(this);
        this._touchMoveHandler = this._handleTouchMove.bind(this);
        this._touchEndHandler = this._handleTouchEnd.bind(this);
    }
    dispose() {
        this._element.removeEventListener('touchstart', this._touchStartHandler);
        this._element.removeEventListener('touchmove', this._touchMoveHandler);
        window.removeEventListener('touchend', this._touchEndHandler);
    }
    init() {
        // istanbul ignore next
        this._element.addEventListener('touchstart', (e) => this._handleTouchStart(e));
        // istanbul ignore next
        this._element.addEventListener('touchmove', (e) => this._handleTouchMove(e));
        // istanbul ignore next
        window.addEventListener('touchend', (e) => this._handleTouchEnd(e));
    }
    _handleTouchStart(e) {
        this[this._event].handleTouchStart(e);
    }
    _handleTouchMove(e) {
        this[this._event].handleTouchMove(e);
    }
    _handleTouchEnd(e) {
        this[this._event].handleTouchEnd(e);
    }
}
exports.default = Touch;
//# sourceMappingURL=index.js.map