import { rpcRequest, rpcResponse } from '../interfaces';
import { rpcChannel } from '../core';
export declare class axoisChannel implements rpcChannel {
    private readonly remotePath;
    constructor(remotePath: string);
    send(request: rpcRequest): Promise<rpcResponse>;
}
//# sourceMappingURL=local.d.ts.map