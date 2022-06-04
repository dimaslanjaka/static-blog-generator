// hexo database manager

import { existsSync } from 'fs';
import { basename, join } from 'upath';
import { read, write } from '../node/filemanager';
import { json_decode, json_encode } from '../node/JSON';
import { parsePermalink } from '../parser/permalink';
import { buildPost, postMap } from '../parser/post/parsePost';
import { excerpt } from '../renderer/ejs/helper/excerpt';
import { thumbnail } from '../renderer/ejs/helper/thumbnail';
import config from '../types/_config';
import { HexoDBType, Post } from './hexo-data';

const dbpath = join(process.cwd(), 'db.json');
const parse = json_decode<HexoDBType>(
  existsSync(dbpath) ? read(dbpath).toString() : '{}'
);
if (!parse.models)
  parse.models = {
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
  };

export class HexoDB {
  addPost(obj: postMap) {
    const perm = parsePermalink(obj);
    const post: Partial<Post> = {
      title: obj.metadata.title,
      date: String(obj.metadata.date || new Date()),
      _content: obj.body || obj.content || '',
      source: (() => {
        const noext = join(
          config.source_dir,
          '_posts',
          obj.metadata.permalink
        ).replace(/.(md|html)$/, '');
        const fullpath = join(process.cwd(), noext);
        if (existsSync(fullpath + '.md')) return noext + '.md';
        if (existsSync(fullpath + '.html')) return noext + '.html';
        if (existsSync(fullpath + '.json')) return noext + '.json';
        return noext;
      })(),
      raw: buildPost(obj),
      __permalink: perm,
      slug: basename(perm).replace(/.(md|html)$/, ''),
      published: 'draft' in obj.metadata ? (obj.metadata.draft ? 1 : 0) : 1,
      updated: String(obj.metadata.updated || obj.metadata.date || new Date()),
      comments:
        'comments' in obj.metadata ? (obj.metadata.comments ? 1 : 0) : 1,
      layout: obj.metadata.type || '',
      photos: [],
      link: '',
      _id: '',
      content: obj.body || obj.content || '',
      site: undefined,
      cover: thumbnail(obj.metadata),
      excerpt: excerpt(obj.metadata),
      more: ''
    };
    if (
      !parse.models.Post.find((epost) => {
        return epost.title === post.title;
      })
    ) {
      parse.models.Post.push(<any>post);
    }
  }
  get() {
    return parse;
  }
  save() {
    write(dbpath, json_encode(parse, 2));
  }
  /**
   * dump
   */
  simplify() {
    return parse.models.Post.map((post) => {
      post._content = '';
      post.content = '';
      post.raw = '';
    });
  }
}
