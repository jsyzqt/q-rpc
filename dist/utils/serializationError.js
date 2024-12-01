"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializationError = void 0;
const isError = (e) => {
    return e &&
        e.stack &&
        e.message &&
        typeof e.stack === 'string' &&
        typeof e.message === 'string';
};
const serializationError = (e) => {
    let serializedError;
    if (e) {
        if (isError(e)) {
            serializedError = JSON.stringify(e, Object.getOwnPropertyNames(e));
        }
        else if (typeof e === 'string') {
            serializedError = e;
        }
        else {
            serializedError = JSON.stringify(e);
        }
        return serializedError;
    }
};
exports.serializationError = serializationError;
//# sourceMappingURL=serializationError.js.map