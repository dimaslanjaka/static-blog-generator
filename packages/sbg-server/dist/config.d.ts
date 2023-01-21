import { createConfig } from 'sbg-utility/dist/config/_config';
declare const serverConfig: createConfig<{
    root: string;
    port: number;
}>;
export default serverConfig;
