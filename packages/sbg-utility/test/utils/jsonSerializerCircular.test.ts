import { beforeAll, describe, expect, it, jest, test } from '@jest/globals';
import path from 'upath';
import { fileURLToPath } from 'url';
import * as utility from '../../src';
import { jsonStringifyWithCircularRefs } from '../../src';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Test class with circular structure
class Circular {
  firstName = '';
  lastName = '';
  getBookType(): string {
    return this.firstName + ' ' + this.lastName;
  }
  inner: Circular[] = [];

  get id() {
    return `Hello ${this.firstName} ${this.lastName}`;
  }
  set id(space) {
    const parts = space.split(' ');
    this.firstName = parts[0];
    this.lastName = parts[1];
  }

  constructor(author?: string, title?: string, loop = false) {
    this.lastName = author || '1';
    this.firstName = title || '2';
    if (loop) {
      for (let index = 0; index < 100; index++) {
        this.inner.push(new Circular(undefined, undefined, false));
      }
    }
  }
}

describe('JSON circular structure handling', () => {
  const obj = {} as Record<string, any>;
  obj.self = obj;
  obj.circular = { ref: obj };
  obj.array = [obj, obj];
  obj.nested = { level1: { level2: { ref: obj } } };

  it('should throw a TypeError when object has circular reference', () => {
    expect(() => JSON.stringify(obj)).toThrow(TypeError);
    expect(() => JSON.stringify(obj)).toThrow(/circular/i);
  });

  it('should stringify without throwing when using custom circular stringify', () => {
    expect(() => jsonStringifyWithCircularRefs(obj)).not.toThrow();
  });
});

describe('Custom JSON serializer and parser with circular support', () => {
  let stringifyResult: string;
  const obj = {
    same: [new Circular(), new Circular()],
    diff: [] as Circular[]
  };

  const jsonStringifyWithCircularRefs = jest.fn((o: any) => utility.jsonStringifyWithCircularRefs(o));
  const jsonParseWithCircularRefs = jest.fn((str: string) => utility.jsonParseWithCircularRefs(str));
  const writefile = jest.fn((file: string, data: any) => utility.writefile(file, data));

  beforeAll(() => {
    ['Billy Butcher', 'Agro Mian', 'X Y', 'alpha beta', 'John Connor'].forEach((name) => {
      const mock = new Circular();
      mock.inner.push(new Circular('A', 'B'), new Circular('C', 'D'), new Circular('E', 'F'));
      mock.id = name;
      obj.diff.push(mock);
    });
  });

  test('should stringify and write to file', () => {
    const file = path.join(__dirname, '../tmp/circular.json');
    stringifyResult = jsonStringifyWithCircularRefs([obj, obj, obj]);
    writefile(file, stringifyResult);

    expect(writefile).toHaveBeenCalledTimes(1);
    expect(jsonStringifyWithCircularRefs).toHaveBeenCalledTimes(1);
  });

  test('should parse and maintain structure', () => {
    const parsed = jsonParseWithCircularRefs(stringifyResult) as (typeof obj)[];

    expect(JSON.stringify(parsed[0].same[0])).toEqual(JSON.stringify(parsed[0].same[1]));
    expect(JSON.stringify(parsed[1].same[0])).toEqual(JSON.stringify(parsed[1].same[1]));
    expect(JSON.stringify(parsed[0].same[0])).toEqual(JSON.stringify(parsed[1].same[1]));
    expect(parsed[0].diff[0].firstName).toBe('Billy');
  });
});
