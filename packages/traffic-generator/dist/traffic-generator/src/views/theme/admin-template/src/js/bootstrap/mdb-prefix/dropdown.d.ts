export default Dropdown;
/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */
declare class Dropdown extends BaseComponent {
    static get Default(): {
        offset: number[];
        flip: boolean;
        boundary: string;
        reference: string;
        display: string;
        popperConfig: any;
    };
    static get DefaultType(): {
        offset: string;
        flip: string;
        boundary: string;
        reference: string;
        display: string;
        popperConfig: string;
    };
    static get DATA_KEY(): string;
    static dropdownInterface(element: any, config: any): void;
    static jQueryInterface(config: any): any;
    static clearMenus(event: any): void;
    static getParentFromElement(element: any): any;
    static dataApiKeydownHandler(event: any): void;
    constructor(element: any, config: any);
    _popper: any;
    _config: any;
    _menu: any;
    _inNavbar: boolean;
    toggle(): void;
    show(): void;
    hide(): void;
    update(): void;
    _addEventListeners(): void;
    _getConfig(config: any): any;
    _getMenuElement(): any;
    _getPlacement(): "top-end" | "top-start" | "bottom-end" | "bottom-start" | "left-start" | "right-start";
    _detectNavbar(): boolean;
    _getOffset(): any;
    _getPopperConfig(): any;
}
import BaseComponent from "./base-component";
//# sourceMappingURL=dropdown.d.ts.map