import bodyParser from 'body-parser';
// import * as http from "http";
import asyncHandler from 'express-async-handler';
import multer from 'multer';
import { serializationError } from '../utils/serializationError';
import { revertBinary } from '../utils/binaryMiddware';

import { QrpcClientFactory, qRPCServer, ClientChannel } from "../core";

type NextFunction = (err?: any) => void;
// type NextHandleFunction = (req: http.ClientRequest, res: http.ServerResponse, next: NextFunction) => void;

const multipartParser = multer();

export class QrpcParser {
    static rpcJson<T>(qrpcServer: qRPCServer<T>, bodyParserOptions?: bodyParser.OptionsJson): [ReturnType<typeof bodyParser>, ReturnType<typeof asyncHandler>] {
        return [
            bodyParser.json(bodyParserOptions),
            asyncHandler(async (req: any, res: any, next: NextFunction) => {
                let re = await qrpcServer.parseMethod(req.body, req, res);
                res.send(re);
            })
        ];
    }


    static rpcMultipart<T>(qrpcServer: qRPCServer<T>): [ReturnType<typeof multipartParser.any>, ReturnType<typeof asyncHandler>] {
        return [
            multipartParser.any(),
            asyncHandler(async (req: any, res: any, next: NextFunction) => {
                let rpcRequestData = JSON.parse(req.body['rpc-json']);

                try {
                    qrpcServer.checkRequestType(rpcRequestData)

                    rpcRequestData = revertBinary(rpcRequestData, req.files as any)
                    // console.log(rpcRequestData)
                    let re = await qrpcServer.parseMethod(rpcRequestData, req, res);
                    res.send(re)
                } catch (e) {
                    // console.log(serializationError(e))
                    res.send({
                        isErr: true,
                        errCode: 1,
                        errMsg: 'Error occours when checking input request data.',
                        remoteThrowed: serializationError(e)
                    })
                }
            })
        ];
    }
}

export const KK = () => {

}