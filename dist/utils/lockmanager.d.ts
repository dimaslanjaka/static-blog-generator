export default class LockManager {
    folder: string;
    file: string;
    constructor(name: string);
    lock(): import("./fm").writefileResult;
    release(): void;
    exist(): boolean;
}
