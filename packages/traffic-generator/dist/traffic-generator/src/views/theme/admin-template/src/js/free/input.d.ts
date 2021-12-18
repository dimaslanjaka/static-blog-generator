export default Input;
/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */
declare class Input {
    static get NAME(): string;
    static activate(instance: any): (event: any) => void;
    static deactivate(instance: any): (event: any) => void;
    static jQueryInterface(config: any, options: any): any;
    static getInstance(element: any): any;
    constructor(element: any);
    _element: any;
    _label: any;
    _labelWidth: number;
    _labelMarginLeft: number;
    _notchLeading: any;
    _notchMiddle: any;
    _notchTrailing: any;
    _initiated: boolean;
    _helper: any;
    _counter: boolean;
    _counterElement: HTMLDivElement;
    _maxLength: number;
    _leadingIcon: any;
    get input(): any;
    init(): void;
    update(): void;
    forceActive(): void;
    forceInactive(): void;
    dispose(): void;
    _getLabelData(): void;
    _getHelper(): void;
    _getCounter(): void;
    _showCounter(): void;
    _bindCounter(): void;
    _showPlaceholder(): void;
    _getNotchData(): void;
    _getLabelWidth(): void;
    _getLabelPositionInInputGroup(): void;
    _applyDivs(): void;
    _applyNotch(): void;
    _removeBorder(): void;
    _activate(event: any): void;
    _getElements(event: any): void;
    _deactivate(event: any): void;
}
//# sourceMappingURL=input.d.ts.map