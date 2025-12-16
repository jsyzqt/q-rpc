export type OrganizedBinaryType = {
    id: string;
    binary: Blob | Uint8Array;
};
export type RPCPayload = {
    payloadObject: any;
    binaries: OrganizedBinaryType[];
};
export type RPCPayloadRaw = {
    headLength: number;
    totalLengh: number;
    headPrefix: number;
    totalPrefix: number;
    head: {
        payloadLength: number;
        binaryNames: string[];
        binaryLengths: number[];
        binaryLengthPrefixs: number[];
    };
    headString: string;
    payloadString: string;
    binaryData: Uint8Array[];
};
export declare const packPayload: (payload: RPCPayload) => Promise<void>;
export declare const unpackPayload: (rawData: Uint8Array) => void;
export declare class HandleArgsBinary {
    static isAbv: (value: any) => any;
    static isBlob: (value: any) => value is Blob;
    static getUniqueID: () => string;
    static convertBinary: (payload: RPCPayload) => RPCPayload;
    static iteratorConvertQrpcRequest: (payloadObject: any, payload: RPCPayload) => void;
    static revertBinary: (payload: RPCPayload, binaryFiles: Express.Multer.File[]) => RPCPayload;
    static iteratorRevertBinary: (payloadObject: any, binaryFiles: Express.Multer.File[]) => void;
}
//# sourceMappingURL=payloadConstructor.d.ts.map