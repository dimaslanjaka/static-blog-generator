export default BaseComponent;
declare class BaseComponent {
    /** Static */
    static getInstance(element: any): any;
    static get VERSION(): string;
    constructor(element: any);
    _element: any;
    dispose(): void;
}
//# sourceMappingURL=base-component.d.ts.map