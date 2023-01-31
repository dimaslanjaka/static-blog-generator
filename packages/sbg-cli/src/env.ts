import ansiColors from 'ansi-colors';
import { Application } from 'sbg-api';

export const api = new Application(process.cwd());
export const rootColor = ansiColors.bgYellowBright.black('ROOT');
