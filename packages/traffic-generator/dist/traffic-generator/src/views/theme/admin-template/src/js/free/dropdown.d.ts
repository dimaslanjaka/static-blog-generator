export default Dropdown;
declare class Dropdown extends BSDropdown {
    static get NAME(): string;
    _parent: any;
    _menuStyle: string;
    _popperPlacement: string;
    _mdbPopperConfig: string;
    _init(): void;
    _bindShowEvent(): void;
    _bindShownEvent(): void;
    _bindHideEvent(): void;
    _bindHiddenEvent(): void;
    _dropdownAnimationStart(action: any): void;
    _bindAnimationEnd(): void;
}
import BSDropdown from "../bootstrap/mdb-prefix/dropdown";
//# sourceMappingURL=dropdown.d.ts.map