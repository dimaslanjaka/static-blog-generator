export default Touch;
declare class Touch {
    constructor(element: any, event?: string, options?: {});
    _element: any;
    _event: string;
    swipe: Swipe;
    _touchStartHandler: any;
    _touchMoveHandler: any;
    _touchEndHandler: any;
    dispose(): void;
    init(): void;
    _handleTouchStart(e: any): void;
    _handleTouchMove(e: any): void;
    _handleTouchEnd(e: any): void;
}
import Swipe from "./swipe";
//# sourceMappingURL=index.d.ts.map