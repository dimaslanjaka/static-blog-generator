declare const sitemap: (link: string | string[], opts?: {
    isProgress: boolean;
    isLog: boolean;
}, callback?: ((arg0: Error | null, arg1?: any) => void) | undefined) => void;
export default sitemap;
