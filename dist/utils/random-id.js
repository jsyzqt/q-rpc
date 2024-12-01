"use strict";
/**
 * https://stackoverflow.com/questions/6860853/generate-random-string-for-div-id
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUniqueID = void 0;
const getUniqueID = () => {
    return String(Date.now()) + Math.random().toString(36).replace(/[^a-z]+/g, '').substring(2, 10);
};
exports.getUniqueID = getUniqueID;
//# sourceMappingURL=random-id.js.map