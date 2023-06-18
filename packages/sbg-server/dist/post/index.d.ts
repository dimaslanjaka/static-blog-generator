import express from 'express';
import * as apis from 'sbg-api';
import { persistentCache } from 'sbg-utility';
import SBGServer from '../server';
export declare const cacheRouterPost: persistentCache;
export interface PostRequestMiddleware extends express.Request {
    origin_post_data: apis.post.ResultSourcePosts[];
    post_data: (apis.post.ResultSourcePosts & apis.post.ResultSourcePosts['metadata'] & Record<string, any>)[];
}
export default function routePost(this: SBGServer, api: apis.Application): import("express-serve-static-core").Router;
