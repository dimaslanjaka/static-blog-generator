export default TouchUtil;
declare class TouchUtil {
    _getCoordinates(e: any): {
        x: any;
        y: any;
    };
    _getDirection(displacement: any): {
        x: {
            direction: string;
            value: number;
        };
        y: {
            direction: string;
            value: number;
        };
    };
}
//# sourceMappingURL=touchUtil.d.ts.map