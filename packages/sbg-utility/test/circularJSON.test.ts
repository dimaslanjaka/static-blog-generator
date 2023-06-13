import { beforeAll, describe, expect, jest, test } from '@jest/globals';
import path from 'upath';
import * as utility from '../src';

class Circular {
  title = '';
  author = '';
  getBookType(): string {
    return this.title + ' ' + this.author;
  }

  // getters => access properties
  // setters => change or mutate them
  get id() {
    return `Hello ${this.title} ${this.author}`;
  }
  set id(space) {
    const parts = space.split(' ');
    this.title = parts[0];
    this.author = parts[1];
  }

  constructor(author?: string | undefined, title?: string | undefined) {
    this.author = author || '1';
    this.title = title || '2';
  }
}

//const mock = new Circular('John', 'Connor');
//console.log(mock.id);
//mock.id = 'Billy Butcher';
//console.log(`${mock.title} ${mock.author}`);

describe('json serializer with circular', () => {
  let stringify: string;
  const obj = {
    /** same properties values */
    same: [new Circular(), new Circular()],
    /** different properties values */
    diff: [] as Circular[]
  };
  const jsonStringifyWithCircularRefs = jest.fn((obj: any) => utility.jsonStringifyWithCircularRefs(obj));
  const jsonParseWithCircularRefs = jest.fn((obj: string) => utility.jsonParseWithCircularRefs(obj));
  const writefile = jest.fn((file: string, obj: any) => utility.writefile(file, obj));

  beforeAll(() => {
    // apply different values
    ['Billy Butcher', 'Agro Mian', 'X Y'].forEach((str) => {
      const mock = new Circular();
      mock.id = str;
      obj.diff.push(mock);
    });
  });

  test('stringify', () => {
    const file = path.join(__dirname, '../tmp/circular.json');
    stringify = jsonStringifyWithCircularRefs([obj, obj, obj]);
    writefile(file, stringify);
    expect(writefile).toHaveBeenCalledTimes(1);
    expect(jsonStringifyWithCircularRefs).toHaveBeenCalledTimes(1);
  });

  test('parse', () => {
    const parse = jsonParseWithCircularRefs(stringify) as (typeof obj)[];
    // expect same property [0] and [1] is equals
    expect(JSON.stringify(parse[0].same[0])).toEqual(JSON.stringify(parse[0].same[1]));
    expect(JSON.stringify(parse[1].same[0])).toEqual(JSON.stringify(parse[1].same[1]));
    expect(JSON.stringify(parse[0].same[0])).toEqual(JSON.stringify(parse[1].same[1]));
    expect(parse[0].diff[0].title).toBe('Billy');
  });
});
