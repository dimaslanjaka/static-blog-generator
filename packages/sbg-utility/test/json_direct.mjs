import json from '../dist/index.mjs';
const { jsonParseWithCircularRefs, jsonStringifyWithCircularRefs } = json;

const content = JSON.stringify([
  '1234567890123456',
  '2345678901234567',
  '3456789012345678',
  '4567890123456789',
  '5678901234567890'
]);
console.log('content', content);
const parsed = jsonParseWithCircularRefs(content);
console.log('parsed', parsed);
const str = jsonStringifyWithCircularRefs(parsed);
console.log('str', str);
