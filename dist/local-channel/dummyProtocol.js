"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DummyProtocol = void 0;
class DummyProtocol {
    constructor(cb) {
        this.cb = cb;
    }
    async send(obj) {
        return await this.cb(JSON.parse(JSON.stringify(obj)));
    }
}
exports.DummyProtocol = DummyProtocol;
//# sourceMappingURL=dummyProtocol.js.map