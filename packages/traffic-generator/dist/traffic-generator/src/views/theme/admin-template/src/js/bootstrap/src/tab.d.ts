export default Tab;
/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */
declare class Tab extends BaseComponent {
    static get DATA_KEY(): string;
    static jQueryInterface(config: any): any;
    show(): void;
    _activate(element: any, container: any, callback: any): void;
    _transitionComplete(element: any, active: any, callback: any): void;
}
import BaseComponent from "./base-component";
//# sourceMappingURL=tab.d.ts.map