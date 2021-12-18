export default ScrollSpy;
/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */
declare class ScrollSpy extends BaseComponent {
    static get Default(): {
        offset: number;
        method: string;
        target: string;
    };
    static get DATA_KEY(): string;
    static jQueryInterface(config: any): any;
    constructor(element: any, config: any);
    _scrollElement: any;
    _config: any;
    _selector: string;
    _offsets: any[];
    _targets: any[];
    _activeTarget: any;
    _scrollHeight: number;
    refresh(): void;
    _getConfig(config: any): any;
    _getScrollTop(): any;
    _getScrollHeight(): any;
    _getOffsetHeight(): any;
    _process(): void;
    _activate(target: any): void;
    _clear(): void;
}
import BaseComponent from "./base-component";
//# sourceMappingURL=scrollspy.d.ts.map