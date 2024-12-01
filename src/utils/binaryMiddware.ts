import { rpcRequest } from '../interfaces';

import { getUniqueID } from './random-id';

//https://stackoverflow.com/questions/21753581/check-for-an-instance-of-arraybufferview
const isAbv = (value: any) => {
    return (value && value.buffer instanceof ArrayBuffer && value.byteLength !== undefined);
    // return ArrayBuffer.isView(value);
}

const isBlob = (value: any) => {
    return value instanceof Blob;
}

export const convertBinary = (request: rpcRequest) => {
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
}

const iteratorConvertQrpcRequest = (requestArgs: any, request: rpcRequest) => {
    for (let i in requestArgs) {
        if (isAbv(requestArgs[i]) || isBlob(requestArgs[i])) {
            if (request.binary === undefined) {
                request.binary = [];
            }
            let tID = `__qrpc_binary_data_id_${getUniqueID()}`;

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
}

export const revertBinary = (request: rpcRequest, binaryFiles: Express.Multer.File[]) => {
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
}


const iteratorRevertBinary = (requestArgs: any, binaryFiles: Express.Multer.File[]) => {
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
}