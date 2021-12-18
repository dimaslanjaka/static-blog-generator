export default Popover;
/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */
declare class Popover extends Tooltip {
    static get Default(): {
        placement: string;
        offset: number[];
        trigger: string;
        content: string;
        template: string;
        animation: boolean;
        title: string;
        delay: number;
        html: boolean;
        selector: boolean;
        container: boolean;
        fallbackPlacements: string[];
        boundary: string;
        customClass: string;
        sanitize: boolean;
        sanitizeFn: any;
        allowList: {
            '*': (string | RegExp)[];
            a: string[];
            area: any[];
            b: any[];
            br: any[];
            col: any[];
            code: any[];
            div: any[];
            em: any[];
            hr: any[];
            h1: any[];
            h2: any[];
            h3: any[];
            h4: any[];
            h5: any[];
            h6: any[];
            i: any[];
            img: string[];
            li: any[];
            ol: any[];
            p: any[];
            pre: any[];
            s: any[];
            small: any[];
            span: any[];
            sub: any[];
            sup: any[];
            strong: any[];
            u: any[];
            ul: any[];
        };
        popperConfig: any;
    };
    static get DefaultType(): {
        content: string;
        animation: string;
        template: string;
        title: string;
        trigger: string;
        delay: string;
        html: string;
        selector: string;
        placement: string;
        offset: string;
        container: string;
        fallbackPlacements: string;
        boundary: string;
        customClass: string;
        sanitize: string;
        sanitizeFn: string;
        /**
         * ------------------------------------------------------------------------
         * Class Definition
         * ------------------------------------------------------------------------
         */
        allowList: string;
        popperConfig: string;
    };
    _getContent(): any;
}
import Tooltip from "./tooltip";
//# sourceMappingURL=popover.d.ts.map