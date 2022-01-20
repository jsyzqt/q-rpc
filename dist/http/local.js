"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.axoisChannel = void 0;
const axios_1 = __importDefault(require("axios"));
class axoisChannel {
    constructor(remotePath) {
        this.remotePath = remotePath;
    }
    async send(request) {
        //let res = await axios.post(this.remotePath, request, { headers: { 'mjRPCClient':request.mjRPCClient } });
        let res = await axios_1.default.post(this.remotePath, request, { headers: { 'mjRPCClient': request.mjRPCClient }, withCredentials: true });
        return res.data;
    }
}
exports.axoisChannel = axoisChannel;
//# sourceMappingURL=local.js.map