export default Carousel;
/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */
declare class Carousel extends BaseComponent {
    static get Default(): {
        interval: number;
        keyboard: boolean;
        slide: boolean;
        pause: string;
        wrap: boolean;
        touch: boolean;
    };
    static get DATA_KEY(): string;
    static carouselInterface(element: any, config: any): void;
    static jQueryInterface(config: any): any;
    static dataApiClickHandler(event: any): void;
    constructor(element: any, config: any);
    _items: any[];
    _interval: NodeJS.Timer;
    _activeElement: any;
    _isPaused: boolean;
    _isSliding: boolean;
    touchTimeout: NodeJS.Timeout;
    touchStartX: number;
    touchDeltaX: number;
    _config: any;
    _indicatorsElement: any;
    _touchSupported: boolean;
    _pointerEvent: boolean;
    next(): void;
    nextWhenVisible(): void;
    prev(): void;
    pause(event: any): void;
    cycle(event: any): void;
    to(index: any): void;
    _getConfig(config: any): any;
    _handleSwipe(): void;
    _addEventListeners(): void;
    _addTouchEventListeners(): void;
    _keydown(event: any): void;
    _getItemIndex(element: any): number;
    _getItemByDirection(direction: any, activeElement: any): any;
    _triggerSlideEvent(relatedTarget: any, eventDirectionName: any): Event;
    _setActiveIndicatorElement(element: any): void;
    _updateInterval(): void;
    _slide(direction: any, element: any): void;
}
import BaseComponent from "./base-component";
//# sourceMappingURL=carousel.d.ts.map