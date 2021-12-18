export default Range;
/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */
declare class Range {
    static get NAME(): string;
    static getInstance(element: any): any;
    static jQueryInterface(config: any, options: any): any;
    constructor(element: any);
    _element: any;
    _initiated: boolean;
    get rangeInput(): any;
    init(): void;
    dispose(): void;
    _addThumb(): void;
    _updateValue(): void;
    _handleEvents(): void;
    _disposeEvents(): void;
    _showThumb(): void;
    _hideThumb(): void;
    _thumbPositionUpdate(): void;
}
//# sourceMappingURL=range.d.ts.map