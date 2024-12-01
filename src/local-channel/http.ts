import { rpcRequest, rpcResponse } from '../interfaces';
import axios from 'axios';
// import FormData from 'form-data';
import {QrpcChannel} from '../core';

import { convertBinary } from '../utils/binaryMiddware';

import {DummyProtocol} from './dummyProtocol';
// import FormData from 'form-data';
// import { Blob } from 'buffer';

// axios.interceptors.request.use(request => {
//     console.log('Starting Request', request.data)
//     return request
// })

export class AxoisChannel implements QrpcChannel{
    constructor(private readonly remotePath:string, private readonly postMode:'json'|'multipart'='json'){}

    public async send(req: rpcRequest): Promise<rpcResponse> {
        
        let request = convertBinary(req);
        if(this.postMode=='multipart'){
            // console.log(JSON.stringify(request))

            
            const form = new FormData();

            
            if(request.binary){
                
                for(let b of request.binary){
                    // console.log(b.binData)
                    // @ts-ignore
                    // form.append('aaa', new Blob(['some content']));
                    form.append(b.id, b.binData);
                }
                delete request.binary
            }
            form.append('rpc-json', JSON.stringify(request));
            // console.log(JSON.stringify(request))

            try{
                let res = await axios.post(this.remotePath, form);
                console.log('res--------------')
                // console.log(res)
                return res.data;
            }catch(e){
                // console.log(e)
            }

            return {} as any
            
        } else {
            let res = await axios.post(this.remotePath, request, { headers: { 'mjRPCClient': request.mjRPCClient }, withCredentials: true });
            return res.data;
        }

    }
}

export class dummyChannel implements QrpcChannel{
    constructor(private readonly dummyProtocol:DummyProtocol){}

    public async send(req: rpcRequest): Promise<rpcResponse> {
        let request = convertBinary(req);
        let res = await this.dummyProtocol.send(request);
        return res;
    }
}