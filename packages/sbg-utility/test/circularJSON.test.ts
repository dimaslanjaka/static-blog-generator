import { beforeAll, describe, expect, jest, test } from '@jest/globals';
import path from 'upath';
import * as utility from '../src';

class Circular {
  firstName = '';
  lastName = '';
  getBookType(): string {
    return this.firstName + ' ' + this.lastName;
  }
  inner: Circular[] = [];

  // getters => access properties
  // setters => change or mutate them
  get id() {
    return `Hello ${this.firstName} ${this.lastName}`;
  }
  set id(space) {
    const parts = space.split(' ');
    this.firstName = parts[0];
    this.lastName = parts[1];
  }

  constructor(author?: string | undefined, title?: string | undefined) {
    this.lastName = author || '1';
    this.firstName = title || '2';
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
    ['Billy Butcher', 'Agro Mian', 'X Y', 'alpha beta', 'John Connor'].forEach((str) => {
      const mock = new Circular();
      mock.inner.push(new Circular('A', 'B'), new Circular('C', 'D'), new Circular('E', 'F'));
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
    expect(parse[0].diff[0].firstName).toBe('Billy');
  });
});
