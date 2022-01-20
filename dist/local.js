"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clientFactory = exports.Client = void 0;
class Client {
    constructor(rpcChannel) {
        this.rpcClientVersion = '0.1a';
        this.rpcChannel = rpcChannel;
    }
    async remoteCall(method, args, version) {
        let reqData = {
            mjRPCClient: this.rpcClientVersion,
            method: method,
            args: args,
            version: version,
            id: 'NULL'
        };
        try {
            let data = await this.rpcChannel.send(reqData);
            let result = {
                isErr: false,
                local: {
                    isErr: false
                },
                remote: data,
                request: reqData,
            };
            if (result.remote == undefined || result.remote.isErr == undefined || (result.remote.remoteReturned == undefined && result.remote.remoteThrowed == undefined)) {
                result.isErr = true;
                result.local.isErr = true;
                result.local.errCode = 1;
                result.local.errMsg = 'RPC return data format error.';
                return result;
            }
            if (!result.remote.isErr) {
                result.isErr = false;
                result.data = result.remote.remoteReturned;
            }
            else {
                result.isErr = true;
                result.data = result.remote.remoteThrowed;
            }
            return result;
        }
        catch (e) {
            return {
                isErr: true,
                local: {
                    isErr: true,
                    errCode: 0,
                    errMsg: JSON.stringify(e)
                },
                request: reqData,
            };
        }
    }
}
exports.Client = Client;
class clientFactory {
    constructor(rpcChannel, clientVersion) {
        this.client = new Client(rpcChannel);
        this.clientVersion = clientVersion;
    }
    load() {
        return new Proxy({}, {
            get: (target, props) => {
                return async (...args) => {
                    try {
                        let res = await this.client.remoteCall(props.toString(), args, this.clientVersion);
                        if (!res.isErr) {
                            return res.data;
                        }
                        else if (res.remote !== undefined && res.remote.isErr) {
                            if (res.remote.errCode == 1) {
                                throw res.remote.remoteThrowed;
                            }
                            else {
                                throw res.remote.errMsg;
                            }
                        }
                        else {
                            throw res.local.errMsg;
                        }
                    }
                    catch (e) {
                        throw e;
                    }
                };
            }
        });
    }
}
exports.clientFactory = clientFactory;
//# sourceMappingURL=local.js.map