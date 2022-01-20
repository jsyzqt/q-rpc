import { rpcResponse, rpcRequest } from './core';

export class Server<T> {
    private readonly serviceMethods: any[];

    constructor(private readonly registerService: any) {
        this.serviceMethods = Reflect.ownKeys(Object.getPrototypeOf(this.registerService));
    }

    public regSev():T{
        
        return this.registerService;
    }

    public async parseMethod(reqData: rpcRequest, ...args:any): Promise<rpcResponse> {
        for (let methodName of this.serviceMethods) {
            if (methodName === reqData.method) {
                try {
                    let re = await Reflect.apply(this.registerService[methodName], this.registerService, [...reqData.args, ...args])
                    return {
                        isErr: false,
                        remoteReturned: re
                    };
                }
                catch (e) {
                    return {
                        isErr: true,
                        errCode: 1,
                        errMsg: 'Function throw an error.',
                        remoteThrowed: JSON.stringify(e)
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