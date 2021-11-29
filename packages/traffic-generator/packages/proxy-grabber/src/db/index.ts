import DBConstructor from './construct';
//https://www.npmjs.com/package/node-json-db
export const getNodeVersion = parseInt(process.version.toLowerCase().replace('v', ''));

export default DBConstructor;
