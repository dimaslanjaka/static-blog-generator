import ansiColors from 'ansi-colors';
import { Application } from 'sbg-api';

let api = new Application(process.env.SBG_CWD || process.cwd());
export const rootColor = ansiColors.bgYellowBright.black('ROOT');

export function getApi() {
  return api;
}

/**
 * change api cwd
 * @param root
 */
export function setApi(root: string) {
  api = new Application(root);
}
