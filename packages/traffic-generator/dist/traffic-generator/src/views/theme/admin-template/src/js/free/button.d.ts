export default Button;
declare class Button extends BSButton {
    static get NAME(): string;
    static jQueryInterface(config: any, options: any): any;
    _fn: {};
    get _actionButton(): any;
    get _buttonListElements(): any[];
    get _buttonList(): any;
    get _isTouchDevice(): boolean;
    show(): void;
    hide(): void;
    _init(): void;
    _bindMouseEnter(): void;
    _bindMouseLeave(): void;
    _bindClick(): void;
    _bindListHideTransitionEnd(): void;
    _bindListOpenTransitionEnd(): void;
    _toggleVisibility(isVisible: any): void;
    _getHeight(element: any): number;
    _saveInitialHeights(): void;
    _initialContainerHeight: number;
    _initialListHeight: number;
    _fullContainerHeight: number;
    _bindInitialEvents(): void;
    _setInitialStyles(): void;
}
import BSButton from "../bootstrap/mdb-prefix/button";
//# sourceMappingURL=button.d.ts.map