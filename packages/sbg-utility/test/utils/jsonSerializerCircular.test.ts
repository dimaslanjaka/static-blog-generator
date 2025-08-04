import { beforeAll, describe, expect, it, test } from '@jest/globals';
import * as fs from 'fs';
import path from 'upath';
import { fileURLToPath } from 'url';
import { writefile } from '../../src/utils/filemanager/writefile';
import { jsonParseWithCircularRefs, jsonStringifyWithCircularRefs } from '../../src/utils/JSON';
import { fromJSON, parse, stringify, toJSON } from '../../src/utils/JSON-serializer';

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

const tmpFile = path.join(__dirname, '../../tmp/circular.json');
const fixtureFile = path.join(__dirname, '../fixtures/circular.json');
const importedCircularJson = JSON.parse(fs.readFileSync(fixtureFile, 'utf-8')) as Record<string, any>;

/**
 * Creates a test object with circular references and sample data.
 */
function createTestObj() {
  const obj = {
    same: [new Circular(), new Circular()],
    diff: [] as Circular[],
    json: importedCircularJson,
    arr: [importedCircularJson, importedCircularJson, importedCircularJson]
  };
  ['Billy Butcher', 'Agro Mian', 'X Y', 'alpha beta', 'John Connor'].forEach((name) => {
    const mock = new Circular();
    mock.inner.push(new Circular('A', 'B'), new Circular('C', 'D'), new Circular('E', 'F'));
    mock.id = name;
    obj.diff.push(mock);
  });
  return obj;
}

describe('JSON circular structure', () => {
  describe('flatted compatibility (JSON-serializer)', () => {
    it('should stringify and parse circular object', () => {
      const obj: Record<string, any> = { name: 'circular', circular: createTestObj() };
      obj.self = obj;
      const str = stringify(obj);
      const parsed = parse(str);
      expect(parsed.name).toBe('circular');
      expect(parsed.self).toBe(parsed);
    });

    it('should toJSON and fromJSON circular object', () => {
      const obj: Record<string, any> = { foo: 'bar' };
      obj.loop = obj;
      const jsonObj = toJSON(obj);
      // The flatted format is an array: [ { foo: '1', loop: '0' }, 'bar' ]
      expect(Array.isArray(jsonObj)).toBe(true);
      expect(jsonObj[0].foo).toBe('1');
      expect(jsonObj[0].loop).toBe('0');
      expect(jsonObj[1]).toBe('bar');
      // Now test fromJSON, which expects an object (not a string)
      const back = fromJSON(jsonObj);
      expect(back.foo).toBe('bar');
      expect(back.loop).toBe(back);
    });
  });

  describe('basic circular structure behavior', () => {
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

  describe('integration with jsonSerializerCircular', () => {
    let stringifyResult: string;
    let obj: ReturnType<typeof createTestObj>;

    beforeAll(() => {
      obj = createTestObj();
    });

    test('should stringify and write to file', () => {
      stringifyResult = jsonStringifyWithCircularRefs([obj, obj, obj]);
      writefile(tmpFile, stringifyResult);
      expect(typeof stringifyResult).toBe('string');
    });

    test('should parse and maintain structure', () => {
      const parsed = jsonParseWithCircularRefs(stringifyResult) as (typeof obj)[];
      expect(JSON.stringify(parsed[0].same[0])).toEqual(JSON.stringify(parsed[0].same[1]));
      expect(JSON.stringify(parsed[1].same[0])).toEqual(JSON.stringify(parsed[1].same[1]));
      expect(JSON.stringify(parsed[0].same[0])).toEqual(JSON.stringify(parsed[1].same[1]));
      expect(parsed[0].diff[0].firstName).toBe('Billy');
    });

    test('should parse fixture and check _id property', () => {
      writefile(tmpFile, jsonStringifyWithCircularRefs(obj));
      const parsed = jsonParseWithCircularRefs(fs.readFileSync(tmpFile, 'utf-8')) as typeof obj;
      expect(Array.isArray(parsed.json)).toBe(true);
      expect(parsed.json[0]._id).toBe('64b26da5221da4b10c86314a');
    });
  });

  describe('jsonParseWithCircularRefs', () => {
    test('should parse normal array', () => {
      const circularArray = ['1101320001160001', '1101320001100001', '1101320001100003'];
      const str = jsonStringifyWithCircularRefs(circularArray);
      const parsed = jsonParseWithCircularRefs(str) as (typeof circularArray)[];
      expect(parsed.length).toBe(3);
      expect(Array.isArray(parsed)).toBe(true);
      expect(parsed).toEqual(circularArray);
      expect(parsed[0]).toBe('1101320001160001');
      expect(parsed[1]).toBe('1101320001100001');
      expect(parsed[2]).toBe('1101320001100003');
    });
  });
});
