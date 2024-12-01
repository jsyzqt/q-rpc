"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.revertBinary = exports.convertBinary = void 0;
const random_id_1 = require("./random-id");
//https://stackoverflow.com/questions/21753581/check-for-an-instance-of-arraybufferview
const isAbv = (value) => {
    return (value && value.buffer instanceof ArrayBuffer && value.byteLength !== undefined);
    // return ArrayBuffer.isView(value);
};
const isBlob = (value) => {
    return value instanceof Blob;
};
const convertBinary = (request) => {
    // for (let i in request.args) {
    //     if (isAbv(request.args[i])) {
    //         if (request.binary === undefined) {
    //             request.binary = [];
    //         }
    //         let tID = `__qrpc_binary_data_id_${getUniqueID()}`;
    //         request.binary.push({
    //             id: tID,
    //             binData: request.args[i]
    //         });
    //         request.args[i] = tID;
    //     }
    // }
    iteratorConvertQrpcRequest(request.args, request);
    return request;
};
exports.convertBinary = convertBinary;
const iteratorConvertQrpcRequest = (requestArgs, request) => {
    for (let i in requestArgs) {
        if (isAbv(requestArgs[i]) || isBlob(requestArgs[i])) {
            if (request.binary === undefined) {
                request.binary = [];
            }
            let tID = `__qrpc_binary_data_id_${(0, random_id_1.getUniqueID)()}`;
            request.binary.push({
                id: tID,
                binData: isBlob(requestArgs[i]) ? requestArgs[i] : new Blob([requestArgs[i]])
            });
            requestArgs[i] = tID;
        }
        if (Array.isArray(requestArgs[i]) || typeof requestArgs[i] === 'object') {
            iteratorConvertQrpcRequest(requestArgs[i], request);
        }
    }
};
const revertBinary = (request, binaryFiles) => {
    // for (let i in request.args) {
    //     if (typeof request.args[i] === 'string' && request.args[i].startsWith('__qrpc_binary_data_id_')) {
    //         if (binaryFiles && binaryFiles.length) {
    //             binaryFiles.forEach(v => {
    //                 if (v.fieldname === request.args[i]) {
    //                     request.args[i] = v.buffer;
    //                 }
    //             });
    //         }
    //     }
    // }
    iteratorRevertBinary(request.args, binaryFiles);
    return request;
};
exports.revertBinary = revertBinary;
const iteratorRevertBinary = (requestArgs, binaryFiles) => {
    for (let i in requestArgs) {
        if (typeof requestArgs[i] === 'string' && requestArgs[i].startsWith('__qrpc_binary_data_id_')) {
            if (binaryFiles && binaryFiles.length) {
                binaryFiles.forEach(v => {
                    if (v.fieldname === requestArgs[i]) {
                        requestArgs[i] = v.buffer;
                    }
                });
            }
        }
        if (Array.isArray(requestArgs[i]) || typeof requestArgs[i] === 'object') {
            iteratorRevertBinary(requestArgs[i], binaryFiles);
        }
    }
};
//# sourceMappingURL=binaryMiddware.js.map