export interface HexoDBType {
  meta: Meta;
  models: Models;
}

export interface Meta {
  version: number;
  warehouse: string;
}

export interface Models {
  Asset: Asset[];
  Cache: Cache[];
  Category: any[];
  Data: any[];
  Page: any[];
  Post: Post[];
  PostAsset: any[];
  PostCategory: any[];
  PostTag: PostTag[];
  Tag: Tag[];
}

export interface Asset {
  _id: string;
  path: string;
  modified: number;
  renderable: number;
}

export interface Cache {
  _id: string;
  hash: string;
  modified: number;
}

export interface Post {
  [key: string]: any;
  title: string;
  date: string;
  /**
   * post body
   */
  _content: string;
  /**
   * @example _posts/2022/20/postname.md
   */
  source: string;
  /**
   * raw markdown
   */
  raw: string;
  slug: string;
  /**
   * 1 = published
   * 0 = drafted
   */
  published: number;
  /**
   * modified date
   */
  updated: string;
  /**
   * 1 = enable comments
   */
  comments: number;
  /**
   * type or layout
   */
  layout: string;
  photos: string[];
  link: string;
  _id: string;
  /**
   * post body
   */
  content: string;
  site: Site;
  cover: string;
  excerpt: string;
  more: string;
}

export interface Site {
  data: Data;
}

export interface Data {
  [key: string]: any;
}

export interface PostTag {
  post_id: string;
  tag_id: string;
  _id: string;
}

export interface Tag {
  name: string;
  _id: string;
}
