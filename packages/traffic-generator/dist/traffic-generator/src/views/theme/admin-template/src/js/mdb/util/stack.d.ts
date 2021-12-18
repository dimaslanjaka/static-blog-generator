export default Stack;
declare class Stack {
    constructor(element: any, selector: any, options: any);
    _element: any;
    _selector: any;
    _options: any;
    _offset: any;
    _parent: any;
    get stackableElements(): any;
    get nextElements(): any[];
    _getConfig(options: any): any;
    _getBoundryOffset(rect: any): number;
    calculateOffset(): any;
}
//# sourceMappingURL=stack.d.ts.map