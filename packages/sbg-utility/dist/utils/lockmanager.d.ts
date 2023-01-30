export default class LockManager {
    folder: string;
    file: string;
    constructor(name: string);
    lock(): import("./filemanager").writefileResult;
    release(): any;
    releaseAsync(): any;
    exist(): any;
}
