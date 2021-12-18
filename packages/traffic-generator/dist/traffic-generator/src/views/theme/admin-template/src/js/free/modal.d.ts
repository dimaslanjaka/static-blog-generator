export default Modal;
declare class Modal extends BSModal {
    static get NAME(): string;
    _init(): void;
    _bindShowEvent(): void;
    _bindShownEvent(): void;
    _bindHideEvent(): void;
    _bindHiddenEvent(): void;
    _bindHidePreventedEvent(): void;
}
import BSModal from "../bootstrap/mdb-prefix/modal";
//# sourceMappingURL=modal.d.ts.map