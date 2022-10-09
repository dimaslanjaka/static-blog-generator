declare type cb = (arg0: Error | null, arg1?: any) => void;
declare const siteMap: (link: string | string[], opts?: {
    isProgress: boolean;
    isLog: boolean;
}, callback?: cb) => void;
export default siteMap;
