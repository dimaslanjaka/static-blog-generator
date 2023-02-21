import * as apis from 'sbg-api';
import { persistentCache } from 'sbg-utility';
import SBGServer from '../server';
export declare const cacheRouterPost: persistentCache;
export default function routePost(this: SBGServer, api: apis.Application): import("express-serve-static-core").Router;
