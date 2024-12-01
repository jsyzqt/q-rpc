"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.qRPCServer = void 0;
const serializationError_1 = require("./utils/serializationError");
const typeCheck_1 = require("./utils/typeCheck");
// type VariableCheckListType = {
//     name: string,
//     type: 'string' | 'number' | 'array',
//     checked?: boolean
// }
// const isError = (e: any) => {
//     return e &&
//         e.stack &&
//         e.message &&
//         typeof e.stack === 'string' &&
//         typeof e.message === 'string';
// };
class qRPCServer {
    constructor(registerService) {
        this.registerService = registerService;
        this.checkTypeList = [
            {
                name: 'mjRPCClient',
                type: 'string'
            },
            {
                name: 'method',
                type: 'string'
            },
            {
                name: 'args',
                type: 'array'
            },
            {
                name: 'additionID',
                type: 'string'
            },
            {
                name: 'id',
                type: 'string'
            }
        ];
        this.serviceMethods = Reflect.ownKeys(Object.getPrototypeOf(this.registerService));
    }
    regSev() {
        return this.registerService;
    }
    checkRequestType(reqData) {
        return (0, typeCheck_1.checkVariableType)(reqData, this.checkTypeList);
    }
    // private checkRequestType(reqData: rpcRequest) {
    //     let checkIndex: VariableCheckListType[] = [
    //         {
    //             name: 'mjRPCClient',
    //             type: 'string'
    //         },
    //         {
    //             name: 'method',
    //             type: 'string'
    //         },
    //         {
    //             name: 'args',
    //             type: 'array'
    //         },
    //         {
    //             name: 'additionID',
    //             type: 'string'
    //         },
    //         {
    //             name: 'id',
    //             type: 'string'
    //         }
    //     ];
    //     const checkIndexName = checkIndex.map(v => v.name);
    //     let toDeleteUnacceptVariableNames: string[] = [];
    //     if (reqData) {
    //         let i: keyof rpcRequest;
    //         for (i in reqData) {
    //             const tI = checkIndexName.findIndex(v => v === i);
    //             if (tI > -1) {
    //                 const tType = checkIndex[tI].type;
    //                 if (tType === 'array' && Array.isArray(reqData[i])) {
    //                     checkIndex[tI]['checked'] = true;
    //                 } else if (typeof reqData[i] === tType) {
    //                     checkIndex[tI]['checked'] = true;
    //                 } else {
    //                     throw new Error(`Request input variable type check error. Type of '${i}' shoud be '${tType}'.`);
    //                 }
    //             } else {
    //                 toDeleteUnacceptVariableNames.push(i);
    //             }
    //         }
    //         if (toDeleteUnacceptVariableNames.length > 0) {
    //             for (let j in toDeleteUnacceptVariableNames) {
    //                 // @ts-ignore
    //                 delete reqData[j];
    //             }
    //             throw new Error(`Unexcept variable in request input, which are ${JSON.stringify(toDeleteUnacceptVariableNames)}`);
    //         }
    //         for (let k in checkIndex) {
    //             if (!checkIndex[k].checked) {
    //                 throw new Error(`Request input variable type check error. Type of '${checkIndex[k].name}' unfound'.`);
    //             }
    //         }
    //     } else {
    //         throw new Error(`Request input data is undefined.`);
    //     }
    //     return true;
    // }
    async parseMethod(reqData, ...args) {
        // try {
        //     this.checkVariableType(reqData);
        // console.log('=============')
        for (let methodName of this.serviceMethods) {
            if (methodName === reqData.method) {
                try {
                    let re = await Reflect.apply(this.registerService[methodName], { ...this.registerService, innerArgs: [...args] }, [...reqData.args]);
                    return {
                        isErr: false,
                        remoteReturned: re
                    };
                }
                catch (e) {
                    // let serializedError: string|undefined;
                    // if (isError(e)) {
                    //     serializedError = JSON.stringify(e, Object.getOwnPropertyNames(e));
                    // } else if (typeof e === 'string') {
                    //     serializedError = e;
                    // }
                    return {
                        isErr: true,
                        errCode: 1,
                        errMsg: 'Function throw an error.',
                        remoteThrowed: (0, serializationError_1.serializationError)(e)
                    };
                }
            }
        }
        return {
            isErr: true,
            errCode: 0,
            errMsg: 'No specified Method.'
        };
        // } catch (e) {
        // return {
        //     isErr: true,
        //     errCode: 0,
        //     errMsg: 'Error occours when checking input request data.',
        //     remoteThrowed: serializationError(e)
        // }
        // }
    }
}
exports.qRPCServer = qRPCServer;
//# sourceMappingURL=remote.js.map