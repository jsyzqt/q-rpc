import bodyParser from 'body-parser';
import asyncHandler from 'express-async-handler';
import multer from 'multer';
import { qRPCServer } from "../core";
declare const multipartParser: multer.Multer;
export declare class QrpcParser {
    static rpcJson<T>(qrpcServer: qRPCServer<T>, bodyParserOptions?: bodyParser.OptionsJson): [ReturnType<typeof bodyParser>, ReturnType<typeof asyncHandler>];
    static rpcMultipart<T>(qrpcServer: qRPCServer<T>): [ReturnType<typeof multipartParser.any>, ReturnType<typeof asyncHandler>];
}
export declare const KK: () => void;
export {};
//# sourceMappingURL=qrpcParser.d.ts.map