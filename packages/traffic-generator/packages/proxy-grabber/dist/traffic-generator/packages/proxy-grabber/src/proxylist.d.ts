import Promise from 'bluebird';
import { returnObj } from './spys';
declare function proxyListOrg(): Promise<returnObj[]>;
export = proxyListOrg;
