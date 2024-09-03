import { rpcCallback, rpcRequest, rpcResponse, rpcChannel } from './core';



export class Client {
    private readonly rpcClientVersion = '0.1a';
    private readonly rpcChannel: rpcChannel;

    constructor(rpcChannel: rpcChannel) {
        this.rpcChannel = rpcChannel;
    }

    public async remoteCall(method: string, args: any[], version: string): Promise<rpcCallback> {
        let reqData: rpcRequest = {
            mjRPCClient: this.rpcClientVersion,
            method: method,
            args: args,
            version: version,
            id: 'NULL'
        }

        try {
            let data: rpcResponse = await this.rpcChannel.send(reqData);

            let result: rpcCallback = {
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
            } else {
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

export class clientFactory {
    private readonly client: Client;
    private readonly clientVersion: string;
    constructor(rpcChannel: rpcChannel, clientVersion: string) {
        this.client = new Client(rpcChannel);
        this.clientVersion = clientVersion;
    }

    public load<T>() {
        return new Proxy({}, {
            get: (target, props) => {
                return async (...args: any[]) => {
                    try {
                        let res = await this.client.remoteCall(props.toString(), args, this.clientVersion);
                        if (!res.isErr) {
                            return res.data;
                        }
                        else if (res.remote !== undefined && res.remote.isErr) {
                            if (res.remote.errCode == 1) {
                                if (!res.remote.remoteThrowed) {
                                    throw new Error('Undefined remote thrown error.');
                                }
                                const parsedError = JSON.parse(res.remote.remoteThrowed);
                                if (typeof parsedError === 'string') {
                                    throw parsedError;
                                } else {
                                    const deserializedError = Object.assign(new Error(), JSON.parse(parsedError));
                                    throw deserializedError;
                                }
                            } else {
                                throw res.remote.errMsg;
                            }
                        }
                        else {
                            throw res.local.errMsg;
                        }
                    } catch (e) {
                        throw e;
                    }
                };
            }
        }) as T;
    }
}
