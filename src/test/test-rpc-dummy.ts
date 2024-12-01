/**
 * https://www.npmjs.com/package/jsonfn
 */

import { JSONfn } from "../utils/jsonfn";

import { Blob } from 'buffer';

import { QrpcClientFactory, qRPCServer } from "../core";

import { DummyProtocol } from '../local-channel/dummyProtocol';

import { dummyChannel } from "../local-channel/http";


class DummyRemoteFunction {
    private aaa = 999
    constructor() {

    }

    async test(a: number, b: string, c: any) {
        // console.log(this)
        // console.log(a)
        return a
        // return (this as any).args[1];
    }
}


const rpcServerIns = new qRPCServer<DummyRemoteFunction>(new DummyRemoteFunction());


const dmPto = new DummyProtocol(async (data: any) => {
    console.log(data)
    return await rpcServerIns.parseMethod(data, { a: 1, b: 2 }, Math.random());
});

let cf = new QrpcClientFactory(new dummyChannel(dmPto), "1a");
let remoteCall: any = cf.load();


(async () => {

    console.log(new Blob([Buffer.from([0,1,2,3])]))

    // for(let i = 0; i <3; i++){
    // const a = await remoteCall.test(Buffer.from([0,1,2,3]));
    const a = await remoteCall.test(123, '123', new Blob([Buffer.from([0, 1, 2, 3])]));

    // console.log(a)
    // }



})();


// console.log(JSONfn.stringify((a:number,b:string)=>{
//     console.log(a)
// }))

// console.log(JSONfn.stringify({
//     a:1,
//     b:2
// }))