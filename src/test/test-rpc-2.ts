import express from 'express';

import { QrpcClientFactory, qRPCServer as qRPCServer, ClientChannel } from "../core";

import { QrpcParser } from '../remote-channel/qrpcParser';

class DummyRemoteFunction {
    private aaa = 999
    constructor() {

    }

    async test(a: any, c: any, b: any) {
        // console.log(this)
        // console.log((this as any).innerArgs[0])
        return '12abc'
    }
}


const rpcServerIns = new qRPCServer<DummyRemoteFunction>(new DummyRemoteFunction());


const datasvApp = express();

datasvApp.post('/rpc', QrpcParser.rpcMultipart(rpcServerIns));

datasvApp.listen(2022).on('listening', async () => {
    let cf = new QrpcClientFactory(new ClientChannel.AxoisChannel('http://127.0.0.1:2022/rpc', 'multipart'));
    let remoteCall: any = cf.load();


    try{
        const a = await remoteCall.test(Buffer.from([0, 1, 2, 3]), new Uint8Array([21, 31]), [{
            a: new Blob([Buffer.from([1, 1, 2, 3])]),
            b: new Blob([Buffer.from([1, 1, 2, 4])])
        }, new Blob([Buffer.from([0, 1, 2, 3])])]);
    
        console.log(a)
    } catch(e){
        console.log(e)
    }

});