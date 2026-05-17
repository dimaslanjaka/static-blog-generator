import { describe, expect, it } from '@jest/globals';
import { getClassName, isClass } from '../../src';

class TestClass {}
function TestFunction() {}
const TestArrowFunction = () => {};
function Person(this: any, name: string, age: number) {
  this.name = name;
  this.age = age;

  // method inside function (instance method)
  this.sayHello = function () {
    console.log('Hello, my name is ' + this.name);
  };
}
describe('class-utils', () => {
  it('getClassName should return the name of a class', () => {
    expect(getClassName(TestClass)).toBe('TestClass');
    expect(getClassName(new TestClass())).toBe('TestClass');
  });
  it('isClass should return true for classes and false for non-classes', () => {
    expect(isClass(TestClass)).toBe(true);
    expect(isClass(TestFunction)).toBe(false);
    expect(isClass(TestArrowFunction)).toBe(false);
    expect(isClass(Person)).toBe(true);
  });
});
