import Promise from 'bluebird';
import { returnObj } from './spys';
declare function sslProxiesOrg(): Promise<returnObj[]>;
export = sslProxiesOrg;
