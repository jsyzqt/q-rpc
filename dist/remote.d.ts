import { rpcResponse, rpcRequest } from './core';
export declare class qRPCServer<T> {
    private readonly registerService;
    private readonly serviceMethods;
    private checkTypeList;
    constructor(registerService: any);
    regSev(): T;
    checkRequestType(reqData: rpcRequest): boolean;
    parseMethod(reqData: rpcRequest, ...args: any): Promise<rpcResponse>;
}
//# sourceMappingURL=remote.d.ts.map