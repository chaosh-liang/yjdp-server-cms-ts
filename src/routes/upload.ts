import path from 'path'
import koaBody from 'koa-body'
import Router from '@koa/router'
import type { File } from 'formidable'

const router = new Router()
const PUBLIC_URL = 'yjdp_public'
const UPLOAD_URL = 'upload'
let fileDirectory = `D:\\${PUBLIC_URL}\\${UPLOAD_URL}`

// @Description 见 server.js 中对应的说明
let protocol_ip = 'http://localhost:7715' // 区分环境

if (process.env.NODE_ENV === 'production') {
  protocol_ip = 'https://liangchaoshun.top'
  fileDirectory = `/opt/material/server/${PUBLIC_URL}/${UPLOAD_URL}`
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
      request: { files },
    } = ctx

    // console.log('upload => ', files)
    const picture = files?.picture as File
    const [filename] = picture.path.match(/\upload_.+$/g) ?? [
      'default_file_name',
    ]
    // console.log('protocol_ip filename => ', protocol_ip, filename);
    ctx.body = {
      error_code: '00',
      data: { res: `${protocol_ip}/${UPLOAD_URL}/${filename}` },
      env: process.env.NODE_ENV,
      error_msg: 'Success',
    }
  }
)

export default router.routes()
