"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSONfn = void 0;
exports.JSONfn = {
    stringify: (obj) => {
        return JSON.stringify(obj, function (key, value) {
            return (typeof value === 'function') ? value.toString() : value;
        });
    },
    parse: (str) => {
        return JSON.parse(str, function (key, value) {
            if (typeof value != 'string')
                return value;
            return (value.substring(0, 8) == 'function') ? eval('(' + value + ')') : value;
        });
    }
};
//# sourceMappingURL=jsonfn.js.map