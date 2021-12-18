export default Toast;
/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */
declare class Toast extends BaseComponent {
    static get DefaultType(): {
        animation: string;
        autohide: string;
        delay: string;
    };
    static get Default(): {
        animation: boolean;
        autohide: boolean;
        delay: number;
    };
    static get DATA_KEY(): string;
    static jQueryInterface(config: any): any;
    constructor(element: any, config: any);
    _config: any;
    _timeout: NodeJS.Timeout;
    show(): void;
    hide(): void;
    _getConfig(config: any): any;
    _setListeners(): void;
    _clearTimeout(): void;
}
import BaseComponent from "./base-component";
//# sourceMappingURL=toast.d.ts.map