const path = require('path');
const koaBody = require('koa-body');
const router = require('@koa/router')();

const PUBLIC_URL = 'dadudu_public';
const UPLOAD_URL = 'upload';
let fileDirectory = `D:\\${PUBLIC_URL}\\${UPLOAD_URL}`;

// @Description 见 server.js 中对应的说明
let ip = 'localhost:7716'; // 区分环境

if (process.env.NODE_ENV === 'production') {
  ip = '101.34.21.222';
  fileDirectory = `/opt/material/server/${PUBLIC_URL}/${UPLOAD_URL}`;
}

// 上传图片
router.post(
  '/',
  koaBody({
    multipart: true, // 支持多个文件上传
    formidable: {
      uploadDir: path.resolve(fileDirectory), // 设置上传目录
      keepExtensions: true, // 保留文件后缀名
    },
  }),
  async (ctx) => {
    const {
      request: {
        files: {
          picture: { path },
        },
      },
    } = ctx;
    const [filename] = path.match(/\upload_.+$/g);
    // console.log('ip filename => ', ip, filename);
    ctx.body = {
      error_code: '00',
      data: { res: `http://${ip}/${UPLOAD_URL}/${filename}` },
      env: process.env.NODE_ENV,
      error_msg: 'Success',
    };
  }
);

module.exports = router.routes();
