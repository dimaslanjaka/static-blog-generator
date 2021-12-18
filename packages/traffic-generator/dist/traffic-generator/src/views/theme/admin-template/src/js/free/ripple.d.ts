export default Ripple;
/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */
declare class Ripple {
    static get NAME(): string;
    static autoInitial(instance: any): (event: any) => void;
    static jQueryInterface(options: any): any;
    static getInstance(element: any): any;
    constructor(element: any, options: any);
    _element: any;
    _options: {};
    _clickHandler: any;
    init(): void;
    dispose(): void;
    _autoInit(event: any): void;
    _addClickEvent(target: any): void;
    _createRipple(event: any): void;
    _createHTMLRipple({ wrapper, ripple, styles }: {
        wrapper: any;
        ripple: any;
        styles: any;
    }): void;
    _removeHTMLRipple({ ripple, duration }: {
        ripple: any;
        duration: any;
    }): void;
    _durationToMsNumber(time: any): number;
    _getConfig(config?: {}): {};
    _getDiameter({ offsetX, offsetY, height, width }: {
        offsetX: any;
        offsetY: any;
        height: any;
        width: any;
    }): number;
    _appendRipple(target: any, parent: any): void;
    _toggleUnbound(target: any): void;
    _addColor(target: any, parent: any): void;
    _removeOldColorClasses(target: any): void;
    _colorToRGB(color: any): any;
}
//# sourceMappingURL=ripple.d.ts.map