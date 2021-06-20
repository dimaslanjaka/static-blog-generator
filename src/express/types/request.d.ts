import { Request } from "express";
export interface URLParameter extends Request {
  /**
   * ?url=... or &url=...
   */
  url: string;
}

export interface PostDataTranslated extends Request, Object {
  html: string;
  path: string;
  tl: string;
  sl: string;
}
