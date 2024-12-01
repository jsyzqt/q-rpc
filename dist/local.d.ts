import { rpcCallback, QrpcChannel } from './core';
export declare class Qrpclient {
    private readonly rpcClientVersion;
    private readonly rpcChannel;
    constructor(rpcChannel: QrpcChannel);
    remoteCall(method: string, args: any[], additionID: string): Promise<rpcCallback>;
}
export declare class QrpcClientFactory {
    private readonly client;
    private readonly additionID;
    constructor(rpcChannel: QrpcChannel, additionID?: string);
    load<T>(): T;
}
//# sourceMappingURL=local.d.ts.map