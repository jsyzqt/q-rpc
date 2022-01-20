import { rpcCallback, rpcChannel } from './core';
export declare class Client {
    private readonly rpcClientVersion;
    private readonly rpcChannel;
    constructor(rpcChannel: rpcChannel);
    remoteCall(method: string, args: any[], version: string): Promise<rpcCallback>;
}
export declare class clientFactory {
    private readonly client;
    private readonly clientVersion;
    constructor(rpcChannel: rpcChannel, clientVersion: string);
    load<T>(): T;
}
//# sourceMappingURL=local.d.ts.map