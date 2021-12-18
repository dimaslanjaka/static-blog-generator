export default FocusTrap;
declare class FocusTrap {
    constructor(element: any, options: {}, toggler: any);
    _element: any;
    _toggler: any;
    _event: any;
    _condition: any;
    _selector: any;
    _onlyVisible: any;
    _focusableElements: any[];
    _firstElement: any;
    _lastElement: any;
    handler: (e: any) => void;
    trap(): void;
    disable(): void;
    update(): void;
    _init(): void;
    _filterVisible(elements: any): any;
    _setElements(): void;
    _setFocusTrap(): void;
}
//# sourceMappingURL=focusTrap.d.ts.map