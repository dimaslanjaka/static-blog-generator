export default Alert;
/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */
declare class Alert extends BaseComponent {
    static get DATA_KEY(): string;
    static jQueryInterface(config: any): any;
    static handleDismiss(alertInstance: any): (event: any) => void;
    close(element: any): void;
    _getRootElement(element: any): any;
    _triggerCloseEvent(element: any): Event;
    _removeElement(element: any): void;
    _destroyElement(element: any): void;
}
import BaseComponent from "./base-component";
//# sourceMappingURL=alert.d.ts.map