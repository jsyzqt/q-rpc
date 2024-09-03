import { rpcResponse, rpcRequest } from './core';

const isError = (e: any) => {
    return e &&
        e.stack &&
        e.message &&
        typeof e.stack === 'string' &&
        typeof e.message === 'string';
};

export class Server<T> {
    private readonly serviceMethods: any[];

    constructor(private readonly registerService: any) {
        this.serviceMethods = Reflect.ownKeys(Object.getPrototypeOf(this.registerService));
    }

    public regSev(): T {

        return this.registerService;
    }

    public async parseMethod(reqData: rpcRequest, ...args: any): Promise<rpcResponse> {
        for (let methodName of this.serviceMethods) {
            if (methodName === reqData.method) {
                try {
                    let re = await Reflect.apply(this.registerService[methodName], this.registerService, [...reqData.args, ...args]) as any
                    return {
                        isErr: false,
                        remoteReturned: re
                    };
                }
                catch (e) {
                    let serializedError: string|undefined;
                    if (isError(e)) {
                        serializedError = JSON.stringify(e, Object.getOwnPropertyNames(e));
                    } else if (typeof e === 'string') {
                        serializedError = e;
                    }
                    return {
                        isErr: true,
                        errCode: 1,
                        errMsg: 'Function throw an error.',
                        remoteThrowed: serializedError
                    }
                }
            }
        }
        return {
            isErr: true,
            errCode: 0,
            errMsg: 'No specified Method.'
        }
    }
}