import express from 'express';
import asyncHandler from 'express-async-handler';
import multer from 'multer';

import bodyParser from 'body-parser';

import { revertBinary } from '../utils/binaryMiddware';

const storage = multer.memoryStorage()
// const upload = multer({ storage: storage })
const upload = multer()

import { QrpcClientFactory, qRPCServer as qRPCServer, ClientChannel } from "../core";

const datasvApp = express();

// datasvApp.use(upload.any());
// datasvApp.use(bodyParser.urlencoded({ extended: true }));
// datasvApp.use(bodyParser.json());

class DummyRemoteFunction {
    private aaa = 999
    constructor(){

    }

    async test(a:any, c:any, b:any){
        // console.log(this)
        // console.log((this as any).innerArgs[0])
        return '12abc'
    }
}


const rpcServerIns = new qRPCServer<DummyRemoteFunction>(new DummyRemoteFunction());

// datasvApp.post('/rpc', express.json({ limit: '50mb' }), asyncHandler(async (req, res, next) => {
//     console.log("===================")
//     console.log(req.files)
//     console.log("===================")
   
//     let re = await rpcServerIns.parseMethod(req.body, req, res);
//     res.send(re)
// }));


// datasvApp.post('/rpc', asyncHandler(async (req, res, next) => {
//     // console.log("===================")
//     // console.log(JSON.parse(req.body['rpc-json']))
//     // console.log(req.files)
//     // console.log("===================")

//     let rpcRequestData = JSON.parse(req.body['rpc-json']);

//     rpcRequestData = await revertBinary(rpcRequestData, req.files as any)
//     console.log(rpcRequestData)
//     let re = await rpcServerIns.parseMethod(rpcRequestData, req, res);
//     res.send(re)
// }));


datasvApp.post('/rpc', [upload.any(), asyncHandler(async (req, res, next) => {
    let rpcRequestData = JSON.parse(req.body['rpc-json']);

    rpcRequestData = revertBinary(rpcRequestData, req.files as any)
    console.log(rpcRequestData)
    let re = await rpcServerIns.parseMethod(rpcRequestData, req, res);
    res.send(re)
})]);


datasvApp.listen(2022).on('listening', async ()=>{
    let cf = new QrpcClientFactory(new ClientChannel.AxoisChannel('http://127.0.0.1:2022/rpc', 'multipart'), "1a");
    let remoteCall: any = cf.load();

    // const a = await remoteCall.test(123, '111', Buffer.from([0, 1, 2, 3]));
    
    
    // const a = await remoteCall.test(123, '111', new Blob([''])); 
    const a = await remoteCall.test(123, '111', [{
        a:new Blob([Buffer.from([1, 1, 2, 3])]),
        b:new Blob([Buffer.from([1, 1, 2, 4])])
    }, new Blob([Buffer.from([0, 1, 2, 3])])]);

    console.log(a)
    // const a = await remoteCall.test(new Blob([Buffer.from([0,1,2,3])]));
});




