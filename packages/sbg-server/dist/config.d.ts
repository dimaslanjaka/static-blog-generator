import { createConfig } from 'sbg-utility';
declare const serverConfig: createConfig<{
    root: string;
    port: number;
    cache: boolean;
}>;
export default serverConfig;
