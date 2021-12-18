export default SelectorEngine;
declare namespace SelectorEngine {
    function matches(element: any, selector: any): any;
    function matches(element: any, selector: any): any;
    function find(selector: any, element?: HTMLElement): any[];
    function find(selector: any, element?: HTMLElement): any[];
    function findOne(selector: any, element?: HTMLElement): any;
    function findOne(selector: any, element?: HTMLElement): any;
    function children(element: any, selector: any): any[];
    function children(element: any, selector: any): any[];
    function parents(element: any, selector: any): any[];
    function parents(element: any, selector: any): any[];
    function prev(element: any, selector: any): any[];
    function prev(element: any, selector: any): any[];
    function next(element: any, selector: any): any[];
    function next(element: any, selector: any): any[];
}
//# sourceMappingURL=selector-engine.d.ts.map