export interface rpcResponse {
    isErr: boolean;
    errCode?: number;
    errMsg?: string;
    remoteReturned?: string;
    remoteThrowed?: string;
}
export interface rpcRequest {
    mjRPCClient: string;
    method: string;
    args: any[];
    additionID: string;
    id: string;
    binary?: {
        id: string;
        binData: Blob;
    }[];
}
export interface rpcLocal {
    isErr: boolean;
    errCode?: number;
    errMsg?: string;
}
export interface rpcCallback {
    isErr: boolean;
    local: rpcLocal;
    remote?: rpcResponse;
    request: rpcRequest;
    data?: any;
}
export interface QrpcChannel {
    send(request: rpcRequest): Promise<rpcResponse>;
}
//# sourceMappingURL=interfaces.d.ts.map