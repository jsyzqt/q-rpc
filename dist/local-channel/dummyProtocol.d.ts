import { QrpcChannel } from '../core';
export declare class DummyProtocol implements QrpcChannel {
    private cb;
    constructor(cb: (data: any) => Promise<any>);
    send(obj: any): Promise<any>;
}
//# sourceMappingURL=dummyProtocol.d.ts.map