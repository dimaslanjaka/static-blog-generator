// sbg-cli v2.0.0 Copyright (c) 2024 Dimas Lanjaka <dimaslanjaka@gmail.com> (https://webmanajemen.com)
import ansiColors from 'ansi-colors';
import { Application } from 'sbg-api';

let api = new Application(process.env.SBG_CWD || process.cwd());
const rootColor = ansiColors.bgYellowBright.black('ROOT');
function getApi() {
    return api;
}
/**
 * change api cwd
 * @param root
 */
function setApi(root) {
    api = new Application(root);
}

export { getApi, rootColor, setApi };
