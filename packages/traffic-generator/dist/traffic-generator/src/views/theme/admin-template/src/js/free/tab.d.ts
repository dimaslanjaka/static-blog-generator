export default Tab;
declare class Tab extends BSTab {
    static get NAME(): string;
    _previous: any;
    _init(): void;
    _bindShowEvent(): void;
    _bindShownEvent(): void;
    _bindHideEvent(): void;
    _bindHiddenEvent(): void;
}
import BSTab from "../bootstrap/mdb-prefix/tab";
//# sourceMappingURL=tab.d.ts.map