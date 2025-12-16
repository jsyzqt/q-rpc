"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HandleArgsBinary = exports.unpackPayload = exports.packPayload = void 0;
const packPayload = async (payload) => {
    let PDRaw = {
        totalLengh: 0,
        headLength: 0,
        headPrefix: 0,
        totalPrefix: 0,
        head: {
            payloadLength: 0,
            binaryNames: [],
            binaryLengths: [],
            binaryLengthPrefixs: []
        },
        headString: '',
        payloadString: '',
        binaryData: []
    };
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
        }
        else if (b instanceof Blob) {
            PDRaw.head.binaryLengths.push(b.size);
            PDRaw.binaryData.push(new Uint8Array(await b.arrayBuffer()));
        }
    }
    for (let i = 0; i < PDRaw.head.binaryLengths.length; i++) {
        PDRaw.head.binaryLengthPrefixs.push(Math.ceil(PDRaw.head.binaryLengths[i] / 0xFF));
    }
    //headLength-headContentString-payloadString-binary[binLength-bin]
    PDRaw.headString = JSON.stringify(PDRaw.head);
    PDRaw.headPrefix = Math.ceil(PDRaw.headString.length / 0xFF);
};
exports.packPayload = packPayload;
const unpackPayload = (rawData) => {
};
exports.unpackPayload = unpackPayload;
class HandleArgsBinary {
}
exports.HandleArgsBinary = HandleArgsBinary;
//https://stackoverflow.com/questions/21753581/check-for-an-instance-of-arraybufferview
HandleArgsBinary.isAbv = (value) => {
    return (value && value.buffer instanceof ArrayBuffer && value.byteLength !== undefined);
    // return ArrayBuffer.isView(value);
};
HandleArgsBinary.isBlob = (value) => {
    return value instanceof Blob;
};
HandleArgsBinary.getUniqueID = () => {
    return String(Date.now()) + Math.random().toString(36).replace(/[^a-z]+/g, '').substring(2, 10);
};
HandleArgsBinary.convertBinary = (payload) => {
    HandleArgsBinary.iteratorConvertQrpcRequest(payload.payloadObject, payload);
    return payload;
};
HandleArgsBinary.iteratorConvertQrpcRequest = (payloadObject, payload) => {
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
};
HandleArgsBinary.revertBinary = (payload, binaryFiles) => {
    HandleArgsBinary.iteratorRevertBinary(payload.payloadObject, binaryFiles);
    return payload;
};
HandleArgsBinary.iteratorRevertBinary = (payloadObject, binaryFiles) => {
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
};
//# sourceMappingURL=payloadConstructor.js.map