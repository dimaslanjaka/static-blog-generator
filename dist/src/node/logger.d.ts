declare const logger: {
    /**
     * false to deactivate logger
     */
    active: boolean;
    assert: () => void;
    clear: () => void;
    count: () => void;
    countReset: () => void;
    debug: () => void;
    dir: () => void;
    dirxml: () => void;
    error: () => void;
    group: () => void;
    groupCollapsed: () => void;
    groupEnd: () => void;
    info: () => void;
    log: () => void;
    table: () => void;
    time: () => void;
    timeEnd: () => void;
    timeLog: () => void;
    trace: () => void;
    warn: () => void;
    doAssert: boolean;
    doClear: boolean;
    doCount: boolean;
    doCountReset: boolean;
    doDebug: boolean;
    doDir: boolean;
    doDirxml: boolean;
    doError: boolean;
    doGroup: boolean;
    doInfo: boolean;
    doLog: boolean;
    doTable: boolean;
    doTime: boolean;
    doTrace: boolean;
    doWarn: boolean;
    timeStamp: (label?: string) => void;
    Console: any;
    profile: (label?: string) => void;
    profileEnd: (label?: string) => void;
};
declare type newConsole = typeof logger & Console & {
    [key: string]: any;
};
declare const _default: newConsole;
export default _default;
