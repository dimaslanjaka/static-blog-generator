export default Modal;
/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */
declare class Modal extends BaseComponent {
    static get Default(): {
        backdrop: boolean;
        keyboard: boolean;
        focus: boolean;
    };
    static get DATA_KEY(): string;
    static jQueryInterface(config: any, relatedTarget: any): any;
    constructor(element: any, config: any);
    _config: any;
    _dialog: any;
    _backdrop: HTMLDivElement;
    _isShown: boolean;
    _isBodyOverflowing: boolean;
    _ignoreBackdropClick: boolean;
    _isTransitioning: boolean;
    _scrollbarWidth: number;
    toggle(relatedTarget: any): void;
    show(relatedTarget: any): void;
    hide(event: any): void;
    handleUpdate(): void;
    _getConfig(config: any): any;
    _showElement(relatedTarget: any): void;
    _enforceFocus(): void;
    _setEscapeEvent(): void;
    _setResizeEvent(): void;
    _hideModal(): void;
    _removeBackdrop(): void;
    _showBackdrop(callback: any): void;
    _triggerBackdropTransition(): void;
    _adjustDialog(): void;
    _resetAdjustments(): void;
    _checkScrollbar(): void;
    _setScrollbar(): void;
    _setElementAttributes(selector: any, styleProp: any, callback: any): void;
    _resetScrollbar(): void;
    _resetElementAttributes(selector: any, styleProp: any): void;
    _getScrollbarWidth(): number;
}
import BaseComponent from "./base-component";
//# sourceMappingURL=modal.d.ts.map