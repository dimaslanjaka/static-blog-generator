declare type cb = (arg0: Error | null, arg1?: any) => void;
interface Opt {
    isProgress: boolean;
    isLog: boolean;
}
declare const siteMap: (link: string | string[], opts?: Opt, callback?: cb) => void;
export default siteMap;
