import { rpcResponse } from './interfaces';

export type OrganizedBinaryType = {
    id: string;
    binary: Blob | Uint8Array
}

export type RPCPayload = {

    payloadObject: any;
    binaries: OrganizedBinaryType[]
}



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
    binaryData: Uint8Array[]
}


export const packPayload = async (payload: RPCPayload) => {

    let PDRaw: RPCPayloadRaw = {
        totalLengh: 0,
        headLength: 0,
        headPrefix: 0,
        totalPrefix:0,
        head: {
            payloadLength: 0,
            binaryNames: [],
            binaryLengths: [],
            binaryLengthPrefixs: []
        },
        headString: '',
        payloadString: '',
        binaryData: []
    }

    const cvPayload = HandleArgsBinary.convertBinary(payload);

    PDRaw.payloadString = JSON.stringify(cvPayload.payloadObject);

    PDRaw.head.payloadLength = PDRaw.payloadString.length;

    for (let i = 0; i < cvPayload.binaries.length; i++) {
        const t = cvPayload.binaries[i];
        const b = t.binary;
        PDRaw.head.binaryNames.push(t.id);
        if (b instanceof ArrayBuffer) {
            PDRaw.head.binaryLengths.push(b.byteLength);
            PDRaw.binaryData.push(new Uint8Array(b));
        } else if (b instanceof Blob) {
            PDRaw.head.binaryLengths.push(b.size);
            PDRaw.binaryData.push(new Uint8Array(await b.arrayBuffer()));
        }
    }

    for(let i = 0; i < PDRaw.head.binaryLengths.length; i++){
        PDRaw.head.binaryLengthPrefixs.push(Math.ceil(PDRaw.head.binaryLengths[i]/0xFF));
    }

    //headLength-headContentString-payloadString-binary[binLength-bin]
    PDRaw.headString = JSON.stringify(PDRaw.head);
    PDRaw.headPrefix = Math.ceil(PDRaw.headString.length / 0xFF);

    

}

export const unpackPayload = (rawData: Uint8Array) => {

}




export class HandleArgsBinary {
    //https://stackoverflow.com/questions/21753581/check-for-an-instance-of-arraybufferview
    static isAbv = (value: any) => {
        return (value && value.buffer instanceof ArrayBuffer && value.byteLength !== undefined);
        // return ArrayBuffer.isView(value);
    }

    static isBlob = (value: any) => {
        return value instanceof Blob;
    }

    static getUniqueID = () => {
        return String(Date.now()) + Math.random().toString(36).replace(/[^a-z]+/g, '').substring(2, 10);
    }

    static convertBinary = (payload: RPCPayload) => {
        HandleArgsBinary.iteratorConvertQrpcRequest(payload.payloadObject, payload);
        return payload;
    }

    static iteratorConvertQrpcRequest = (payloadObject: any, payload: RPCPayload) => {
        for (let i in payloadObject) {
            if (HandleArgsBinary.isAbv(payloadObject[i]) || HandleArgsBinary.isBlob(payloadObject[i])) {
                if (payload.binaries === undefined) {
                    payload.binaries = [];
                }
                let tID = `__qrpc_binary_data_id_${HandleArgsBinary.getUniqueID()}`;

                payload.binaries.push({
                    id: tID,
                    binary: HandleArgsBinary.isBlob(payloadObject[i]) ? payloadObject[i] : new Blob([payloadObject[i]])
                });

                payloadObject[i] = tID;
            }
            if (Array.isArray(payloadObject[i]) || typeof payloadObject[i] === 'object') {
                HandleArgsBinary.iteratorConvertQrpcRequest(payloadObject[i], payload);
            }
        }
    }

    static revertBinary = (payload: RPCPayload, binaryFiles: Express.Multer.File[]) => {
        HandleArgsBinary.iteratorRevertBinary(payload.payloadObject, binaryFiles);
        return payload;
    }

    static iteratorRevertBinary = (payloadObject: any, binaryFiles: Express.Multer.File[]) => {
        for (let i in payloadObject) {
            if (typeof payloadObject[i] === 'string' && payloadObject[i].startsWith('__qrpc_binary_data_id_')) {
                if (binaryFiles && binaryFiles.length) {
                    binaryFiles.forEach(v => {
                        if (v.fieldname === payloadObject[i]) {
                            payloadObject[i] = v.buffer;
                        }
                    });
                }
            }
            if (Array.isArray(payloadObject[i]) || typeof payloadObject[i] === 'object') {
                HandleArgsBinary.iteratorRevertBinary(payloadObject[i], binaryFiles);
            }
        }
    }
}