// hexo database manager

import { existsSync } from 'fs';
import { join } from 'upath';
import { read, write } from '../node/filemanager';
import { json_decode, json_encode } from '../node/JSON';
import { parsePermalink } from '../parser/permalink';
import { buildPost, postMap } from '../parser/post/parsePost';
import { excerpt } from '../renderer/ejs/helper/excerpt';
import { thumbnail } from '../renderer/ejs/helper/thumbnail';
import { HexoDBType, Post } from './hexo-data';

export const HexoDBPath = join(process.cwd(), 'db.json');
export class HexoDB {
  parse: HexoDBType = {
    meta: {
      version: 0,
      warehouse: ''
    },
    models: {
      Post: [],
      Tag: [],
      PostTag: [],
      PostCategory: [],
      Asset: [],
      Page: [],
      Cache: [],
      Category: [],
      PostAsset: [],
      Data: []
    }
  };
  constructor() {
    this.parse = json_decode<HexoDBType>(
      existsSync(HexoDBPath) ? read(HexoDBPath).toString() : '{}'
    );
  }
  addPost(obj: postMap) {
    const perm = parsePermalink(obj);
    const post: Post = {
      title: obj.metadata.title,
      date: String(obj.metadata.date || new Date()),
      _content: obj.body || obj.content || '',
      source: '',
      raw: buildPost(obj),
      slug: perm,
      published: 'draft' in obj.metadata ? (obj.metadata.draft ? 1 : 0) : 1,
      updated: String(obj.metadata.updated || obj.metadata.date || new Date()),
      comments:
        'comments' in obj.metadata ? (obj.metadata.comments ? 1 : 0) : 1,
      layout: obj.metadata.type || '',
      photos: [],
      link: '',
      _id: '', // obj.metadata.uuid ||
      content: obj.body || obj.content || '',
      site: undefined,
      cover: thumbnail(obj.metadata),
      excerpt: excerpt(obj.metadata),
      more: ''
    };
    if (
      !this.parse.models.Post.find((epost) => {
        return epost.title === post.title;
      })
    ) {
      this.parse.models.Post.push(post);
    }
  }
  get() {
    return this.parse;
  }
  save() {
    write(HexoDBPath, json_encode(this.parse, 2));
  }
  /**
   * dump
   */
  simplify() {
    return this.parse.models.Post.map((post) => {
      post._content = '';
      post.content = '';
      post.raw = '';
    });
  }
}
