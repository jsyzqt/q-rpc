
import {QrpcChannel} from '../core';


export class DummyProtocol implements QrpcChannel{
    private cb:(data:any)=>Promise<any>;

    constructor(cb:(data:any)=>Promise<any>){
        this.cb = cb;
    }

    async send(obj:any){
        return await this.cb(JSON.parse(JSON.stringify(obj)));
    }
}