import { createConfig } from 'sbg-utility';
declare const serverConfig: createConfig<{
    root: string;
    port: number;
}>;
export default serverConfig;
