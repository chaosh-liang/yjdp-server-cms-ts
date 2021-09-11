const path = require('path');
const koaBody = require('koa-body');
const router = require('@koa/router')();

const public_url = 'public';
const upload_url = 'upload';
const fileDirectory = path.join(__dirname, '../../', public_url, upload_url);

// @Note 见 server.js 中对应的说明
const ip = process.env.NODE_ENV === 'production' ? '101.34.21.222' : 'localhost'; // 区分环境

// 上传图片
router.post(
  '/',
  koaBody({
    multipart: true, // 支持多个文件上传
    formidable: {
      uploadDir: fileDirectory, // 设置上传目录
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
      data: { res: `http://${ip}/${upload_url}/${filename}` },
      env: process.env.NODE_ENV,
      error_msg: 'Success',
    };
  }
);

module.exports = router.routes();
