"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.areWeTestingWithJest = void 0;
function areWeTestingWithJest() {
    return process.env.JEST_WORKER_ID !== undefined;
}
exports.areWeTestingWithJest = areWeTestingWithJest;
