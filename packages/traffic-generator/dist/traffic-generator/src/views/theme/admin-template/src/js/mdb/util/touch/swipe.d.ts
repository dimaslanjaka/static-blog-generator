export default Swipe;
declare class Swipe extends TouchUtil {
    constructor(element: any, options: any);
    _element: any;
    _startPosition: {
        x: any;
        y: any;
    };
    _options: any;
    handleTouchStart(e: any): void;
    handleTouchMove(e: any): void;
    handleTouchEnd(): void;
}
import TouchUtil from "./touchUtil";
//# sourceMappingURL=swipe.d.ts.map