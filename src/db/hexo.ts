// hexo database manager

import { existsSync } from 'fs';
import { join } from 'upath';
import { read, write } from '../node/filemanager';
import { json_decode, json_encode } from '../node/JSON';
import { buildPost, postMap } from '../parser/post/parsePost';
import { thumbnail } from '../renderer/ejs/helper/thumbnail';
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
    const post: Post = {
      title: obj.metadata.title,
      date: String(obj.metadata.date || new Date()),
      _content: obj.body || obj.content || '',
      source: '',
      raw: buildPost(obj),
      slug: '',
      published: 'draft' in obj.metadata ? 0 : 1,
      updated: String(obj.metadata.updated || obj.metadata.date || new Date()),
      comments:
        'comments' in obj.metadata ? (obj.metadata.comments ? 1 : 0) : 1,
      layout: '',
      photos: [],
      link: '',
      _id: '',
      content: obj.body || obj.content || '',
      site: undefined,
      cover: thumbnail(obj.metadata),
      excerpt: '',
      more: ''
    };
    if (
      !parse.models.Post.find((epost) => {
        return epost.title !== post.title;
      })
    ) {
      parse.models.Post.push(post);
      this.save();
    }
  }
  get() {
    return parse;
  }
  save() {
    write(dbpath, json_encode(parse, 2));
  }
}
