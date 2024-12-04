"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dummyChannel = exports.AxoisChannel = void 0;
const axios_1 = __importDefault(require("axios"));
const binaryMiddware_1 = require("../utils/binaryMiddware");
// import FormData from 'form-data';
// import { Blob } from 'buffer';
// axios.interceptors.request.use(request => {
//     console.log('Starting Request', request.data)
//     return request
// })
class AxoisChannel {
    constructor(remotePath, postMode = 'json', axiosOptions) {
        this.remotePath = remotePath;
        this.postMode = postMode;
        this.axiosOptions = axiosOptions;
    }
    async send(req) {
        let request = (0, binaryMiddware_1.convertBinary)(req);
        if (this.postMode == 'multipart') {
            // console.log(JSON.stringify(request))
            const form = new FormData();
            if (request.binary) {
                for (let b of request.binary) {
                    // console.log(b.binData)
                    // @ts-ignore
                    // form.append('aaa', new Blob(['some content']));
                    form.append(b.id, b.binData);
                }
                delete request.binary;
            }
            form.append('rpc-json', JSON.stringify(request));
            // console.log(JSON.stringify(request))
            try {
                let res = await axios_1.default.post(this.remotePath, form, this.axiosOptions);
                console.log('res--------------');
                // console.log(res)
                return res.data;
            }
            catch (e) {
                // console.log(e)
            }
            return {};
        }
        else {
            let res = await axios_1.default.post(this.remotePath, request, { headers: { 'mjRPCClient': request.mjRPCClient }, withCredentials: true });
            return res.data;
        }
    }
}
exports.AxoisChannel = AxoisChannel;
class dummyChannel {
    constructor(dummyProtocol) {
        this.dummyProtocol = dummyProtocol;
    }
    async send(req) {
        let request = (0, binaryMiddware_1.convertBinary)(req);
        let res = await this.dummyProtocol.send(request);
        return res;
    }
}
exports.dummyChannel = dummyChannel;
//# sourceMappingURL=http.js.map