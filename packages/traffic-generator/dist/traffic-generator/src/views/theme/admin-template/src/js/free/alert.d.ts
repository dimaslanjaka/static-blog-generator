export default Alert;
declare class Alert extends BSAlert {
    static get NAME(): string;
    constructor(element: any, data?: {});
    _init(): void;
    _bindCloseEvent(): void;
    _bindClosedEvent(): void;
}
import BSAlert from "../bootstrap/mdb-prefix/alert";
//# sourceMappingURL=alert.d.ts.map