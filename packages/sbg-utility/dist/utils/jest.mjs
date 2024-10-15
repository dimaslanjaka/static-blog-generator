/**
 * Check if current runner is JEST
 * * source: {@link https://stackoverflow.com/a/52231746}
 * @returns
 */
function areWeTestingWithJest() {
    return process.env.JEST_WORKER_ID !== undefined;
}

export { areWeTestingWithJest };
