import sbgUtility from 'sbg-utility';

const fromStr = sbgUtility.escapeRegex('source-posts')!;
const regex = new RegExp(`[\\/\\\\]${fromStr}[\\/\\\\]`);
console.log(regex);
