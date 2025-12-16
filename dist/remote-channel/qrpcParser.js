"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KK = exports.QrpcParser = void 0;
const body_parser_1 = __importDefault(require("body-parser"));
// import * as http from "http";
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const multer_1 = __importDefault(require("multer"));
const serializationError_1 = require("../utils/serializationError");
const binaryMiddware_1 = require("../utils/binaryMiddware");
// type NextHandleFunction = (req: http.ClientRequest, res: http.ServerResponse, next: NextFunction) => void;
const multipartParser = (0, multer_1.default)();
class QrpcParser {
    static rpcJson(qrpcServer, bodyParserOptions) {
        return [
            body_parser_1.default.json(bodyParserOptions),
            (0, express_async_handler_1.default)(async (req, res, next) => {
                let re = await qrpcServer.parseMethod(req.body, req, res);
                res.send(re);
            })
        ];
    }
    static rpcMultipart(qrpcServer) {
        return [
            (0, multer_1.default)().any(),
            (0, express_async_handler_1.default)(async (req, res, next) => {
                let rpcRequestData = JSON.parse(req.body['rpc-json']);
                try {
                    qrpcServer.checkRequestType(rpcRequestData);
                    rpcRequestData = (0, binaryMiddware_1.revertBinary)(rpcRequestData, req.files);
                    // console.log(rpcRequestData)
                    let re = await qrpcServer.parseMethod(rpcRequestData, req, res);
                    res.send(re);
                }
                catch (e) {
                    // console.log(serializationError(e))
                    res.send({
                        isErr: true,
                        errCode: 1,
                        errMsg: 'Error occours when checking input request data.',
                        remoteThrowed: (0, serializationError_1.serializationError)(e)
                    });
                }
            })
        ];
    }
}
exports.QrpcParser = QrpcParser;
const KK = () => {
};
exports.KK = KK;
//# sourceMappingURL=qrpcParser.js.map