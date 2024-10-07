"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const isError = (e) => {
    return e &&
        e.stack &&
        e.message &&
        typeof e.stack === 'string' &&
        typeof e.message === 'string';
};
class Server {
    constructor(registerService) {
        this.registerService = registerService;
        this.serviceMethods = Reflect.ownKeys(Object.getPrototypeOf(this.registerService));
    }
    regSev() {
        return this.registerService;
    }
    async parseMethod(reqData, ...args) {
        for (let methodName of this.serviceMethods) {
            if (methodName === reqData.method) {
                try {
                    let re = await Reflect.apply(this.registerService[methodName], this.registerService, [...reqData.args, ...args]);
                    return {
                        isErr: false,
                        remoteReturned: re
                    };
                }
                catch (e) {
                    let serializedError;
                    if (isError(e)) {
                        serializedError = JSON.stringify(e, Object.getOwnPropertyNames(e));
                    }
                    else if (typeof e === 'string') {
                        serializedError = e;
                    }
                    return {
                        isErr: true,
                        errCode: 1,
                        errMsg: 'Function throw an error.',
                        remoteThrowed: serializedError
                    };
                }
            }
        }
        return {
            isErr: true,
            errCode: 0,
            errMsg: 'No specified Method.'
        };
    }
}
exports.Server = Server;
//# sourceMappingURL=remote.js.map