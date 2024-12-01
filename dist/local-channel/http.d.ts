import { rpcRequest, rpcResponse } from '../interfaces';
import { QrpcChannel } from '../core';
import { DummyProtocol } from './dummyProtocol';
export declare class AxoisChannel implements QrpcChannel {
    private readonly remotePath;
    private readonly postMode;
    constructor(remotePath: string, postMode?: 'json' | 'multipart');
    send(req: rpcRequest): Promise<rpcResponse>;
}
export declare class dummyChannel implements QrpcChannel {
    private readonly dummyProtocol;
    constructor(dummyProtocol: DummyProtocol);
    send(req: rpcRequest): Promise<rpcResponse>;
}
//# sourceMappingURL=http.d.ts.map