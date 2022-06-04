// hexo database manager

import { join } from 'upath';
import { read, write } from '../node/filemanager';
import { json_decode, json_encode } from '../node/JSON';
import { postMap } from '../parser/post/parsePost';
import { HexoDBType, Post } from './hexo-data';

const dbpath = join(process.cwd(), 'db.json');
const parse = json_decode<HexoDBType>(read(dbpath).toString());

export class HexoDB {
  addPost(obj: postMap) {
    const post: Post = {
      title: obj.metadata.title,
      date: obj.metadata.date,
      _content: obj.body || obj.content,
      source: '',
      raw: '',
      slug: '',
      published: 0,
      updated: '',
      comments: 0,
      layout: '',
      photos: [],
      link: '',
      _id: '',
      content: '',
      site: undefined,
      cover: '',
      excerpt: '',
      more: ''
    };
    parse.models.Post.push(post);
  }
  get() {
    return parse;
  }
  save() {
    write(dbpath, json_encode(parse, 2));
  }
}
