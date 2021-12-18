export default Collapse;
/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */
declare class Collapse extends BaseComponent {
    static get Default(): {
        toggle: boolean;
        parent: string;
    };
    static get DATA_KEY(): string;
    static collapseInterface(element: any, config: any): void;
    static jQueryInterface(config: any): any;
    constructor(element: any, config: any);
    _isTransitioning: boolean;
    _config: any;
    _triggerArray: any[];
    _selector: any;
    _parent: any;
    toggle(): void;
    show(): void;
    hide(): void;
    setTransitioning(isTransitioning: any): void;
    _getConfig(config: any): any;
    _getDimension(): "height" | "width";
    _getParent(): any;
    _addAriaAndCollapsedClass(element: any, triggerArray: any): void;
}
import BaseComponent from "./base-component";
//# sourceMappingURL=collapse.d.ts.map