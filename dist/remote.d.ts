import { rpcResponse, rpcRequest } from './core';
export declare class Server<T> {
    private readonly registerService;
    private readonly serviceMethods;
    constructor(registerService: any);
    regSev(): T;
    parseMethod(reqData: rpcRequest, ...args: any): Promise<rpcResponse>;
}
//# sourceMappingURL=remote.d.ts.map