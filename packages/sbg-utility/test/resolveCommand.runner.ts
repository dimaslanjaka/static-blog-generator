import { resolveCommand } from '../src';

// Start measuring time
const start = process.hrtime();

// Call the function
const result = resolveCommand('tsc');

// End measuring time
const end = process.hrtime(start);

// Calculate the execution time in milliseconds
const executionTime = end[0] * 1000 + end[1] / 1e6; // Convert seconds to milliseconds

console.log(result);
console.log(`Execution Time: ${executionTime.toFixed(3)} milliseconds`);
