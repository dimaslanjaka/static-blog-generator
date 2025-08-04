import json from '../src/index';
const { jsonParseWithCircularRefs, jsonStringifyWithCircularRefs } = json;

const content = JSON.stringify([
  '1234567890123456',
  '2345678901234567',
  '3456789012345678',
  '4567890123456789',
  '5678901234567890'
]);
console.log('content', content);
const parsed = jsonParseWithCircularRefs<string[]>(content);
console.log('parsed', parsed);
const str = jsonStringifyWithCircularRefs(parsed);
console.log('str', str);
console.log('length parsed should be 5:', parsed.length === 5);
