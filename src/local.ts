import { rpcCallback, rpcRequest, rpcResponse, QrpcChannel } from './core';

import { getUniqueID } from './utils/random-id';

export class Qrpclient {
    private readonly rpcClientVersion = '0.1b';
    private readonly rpcChannel: QrpcChannel;

    constructor(rpcChannel: QrpcChannel) {
        this.rpcChannel = rpcChannel;
    }

    public async remoteCall(method: string, args: any[], additionID: string): Promise<rpcCallback> {

        let reqData: rpcRequest = {
            mjRPCClient: this.rpcClientVersion,
            method: method,
            args: args,
            additionID: additionID,
            id: getUniqueID(),
            // // @ts-ignore
            // args2: true
        }

        for(let i in args){
            if(typeof args[i] === 'function'){
                
            }
        }

        // try {
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
        // }
        // catch (e) {
        //     return {
        //         isErr: true,
        //         local: {
        //             isErr: true,
        //             errCode: 0,
        //             errMsg: JSON.stringify(e) //JSON.stringify(e, Object.getOwnPropertyNames(e))
        //         },
        //         request: reqData,
        //     };
        // }
    }
}

export class QrpcClientFactory {
    private readonly client: Qrpclient;
    private readonly additionID: string;
    constructor(rpcChannel: QrpcChannel, additionID: string = 'default') {
        this.client = new Qrpclient(rpcChannel);
        this.additionID = additionID;
    }

    public load<T>() {
        return new Proxy({}, {
            get: (target, props) => {
                return async (...args: any[]) => {
                    try {
                        let res = await this.client.remoteCall(props.toString(), args, this.additionID);
                        if (!res.isErr) {
                            return res.data;
                        }
                        else if (res.remote !== undefined && res.remote.isErr) {
                            let remoteErr = new Error();

                            if (res.remote.remoteThrowed) {
                                try {
                                    remoteErr = Object.assign(new Error(), JSON.parse(res.remote.remoteThrowed));

                                    // @ts-ignore
                                    remoteErr.remoteThrowdError = remoteErr.message;
                                } catch (e) { 
                                    // @ts-ignore
                                    remoteErr.remoteThrowdError = res.remote.remoteThrowed;
                                };
                            }

                            // console.log('==========')
                            // console.log(remoteErr.message)
                            // console.log('===---====')

                            if (res.remote.errMsg) {
                                // @ts-ignore
                                remoteErr.remoteErrorMassage = res.remote.errMsg;
                            }
                            if (res.remote.errCode) {
                                // @ts-ignore
                                remoteErr.remoteErrorCode = res.remote.errCode;
                            }

                            throw remoteErr;

                            // if (res.remote.remoteThrowed) {
                            //     // if (!res.remote.remoteThrowed) {
                            //     //     throw new Error('Undefined remote thrown error.');
                            //     // }

                            //     let remoteErrorData = res.remote.remoteThrowed;
                            //     try {
                            //         remoteErrorData = Object.assign(new Error(), JSON.parse(remoteErrorData));
                            //         // @ts-ignore
                            //         remoteErrorData.remoteErrorCode = res.remote.errCode;
                            //         // @ts-ignore
                            //         remoteErrorData.remoteErrorMassage = res.remote.errMsg;

                            //     } catch (e) { };

                            //     throw remoteErrorData;




                            //     // const parsedError =  Object.assign(new Error(), JSON.parse(res.remote.remoteThrowed)); //JSON.parse(res.remote.remoteThrowed);
                            //     // throw parsedError;
                            //     // if (typeof parsedError === 'string') {
                            //     //     throw parsedError;
                            //     // } else {
                            //     //     const deserializedError = Object.assign(new Error(), JSON.parse(parsedError));
                            //     //     throw deserializedError;
                            //     // }
                            // } else {
                            //     throw new Error(res.remote.errMsg);
                            // }
                        }
                        else {
                            // console.log(res.local.errMsg)
                            // throw new Error(res.local.errMsg);
                            if (res.local.errMsg) {
                                const a = typeof res.local.errMsg === 'string' ? { errorMsg: res.local.errMsg } : JSON.parse(res.local.errMsg)
                                throw Object.assign(new Error(), a)
                            } else {
                                throw new Error('unexpect error.')
                            }
                        }
                    } catch (e) {
                        throw e;
                    }
                };
            }
        }) as T;
    }
}
