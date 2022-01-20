import { rpcRequest, rpcResponse } from '../interfaces';
import axios from 'axios';
// import FormData from 'form-data';
import {rpcChannel} from '../core';

export class axoisChannel implements rpcChannel{
    constructor(private readonly remotePath:string){}

    public async send(request: rpcRequest): Promise<rpcResponse> {
        //let res = await axios.post(this.remotePath, request, { headers: { 'mjRPCClient':request.mjRPCClient } });
        let res = await axios.post(this.remotePath, request, { headers: { 'mjRPCClient': request.mjRPCClient }, withCredentials: true });
        return res.data;
    }
}