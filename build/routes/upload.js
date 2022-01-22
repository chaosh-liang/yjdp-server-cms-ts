"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const koa_body_1 = __importDefault(require("koa-body"));
const router_1 = __importDefault(require("@koa/router"));
const router = new router_1.default();
const PUBLIC_URL = 'yjdp_public';
const UPLOAD_URL = 'upload';
let fileDirectory = `D:\\${PUBLIC_URL}\\${UPLOAD_URL}`;
let protocol_ip = 'http://localhost:7715';
if (process.env.NODE_ENV === 'production') {
    protocol_ip = 'https://liangchaoshun.top';
    fileDirectory = `/opt/material/server/${PUBLIC_URL}/${UPLOAD_URL}`;
}
router.post('/', (0, koa_body_1.default)({
    multipart: true,
    formidable: {
        uploadDir: path_1.default.resolve(fileDirectory),
        keepExtensions: true,
    },
}), async (ctx) => {
    const { request: { files }, } = ctx;
    const picture = files?.picture;
    const [filename] = picture.path.match(/\upload_.+$/g) ?? [
        'default_file_name',
    ];
    ctx.body = {
        error_code: '00',
        data: { res: `${protocol_ip}/${UPLOAD_URL}/${filename}` },
        env: process.env.NODE_ENV,
        error_msg: 'Success',
    };
});
exports.default = router.routes();
