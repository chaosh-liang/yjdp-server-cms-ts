import https from 'https'
import Router from '@koa/router'
import userModel from '../model/users'
const router = new Router()

// 获取图片必应每日一图：Promise 封装请求
const fetchBingImage = () => {
  return new Promise((resolve, reject) => {
    https
      .get(
        'https://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1',
        (resp) => {
          let data = ''
          resp.on('data', (chunk) => {
            data += chunk
          })

          resp.on('end', () => {
            // console.log('data => ', data);
            resolve(JSON.parse(data))
          })
        }
      )
      .on('error', (error) => {
        console.log('Error: ', error.message)
        reject(error.message)
      })
  })
}

// 登录
router.post('/login', async (ctx) => {
  const {
    request: {
      body: { user_name, password },
    },
  } = ctx // 参数
  try {
    const accountRes = await userModel.findOne({ user_name })
    const res = await userModel.findOne({ user_name, password })
    if (!accountRes) {
      ctx.body = { error_code: '92', data: null, error_msg: '帐号不存在' }
    } else if (res) {
      const { user_name, role } = res
      const buff = Buffer.from(`${role}`, 'utf-8') // 转化成 base64
      const base64_role = buff.toString('base64')
      let n = ctx.session?.views ?? 0
      ctx.session!.views = n++
      ctx.body = {
        error_code: '00',
        data: { res: { user_name, role: base64_role } },
        error_msg: '登录成功',
      }
      ctx.response.status = 200
    } else {
      ctx.body = { error_code: '93', data: null, error_msg: '密码错误' }
    }
  } catch (error) {
    console.log('/login error => ', error)
  }
})

// 获取图片必应每日一图
router.get('/bing', async (ctx) => {
  try {
    const data = await fetchBingImage()
    if (data) {
      // console.log('/bing success => ', data);
      ctx.body = {
        error_code: '00',
        data: { res: { data } },
        error_msg: '',
      }
    }
  } catch (error) {
    console.log('/bing error => ', error)
    ctx.body = { error_code: '00', data: null, error_msg: error }
  }
})

// 注销
router.get('/logout', async (ctx) => {
  ctx.session = null
  ctx.body = { error_code: '00', data: null, error_msg: '退出成功' }
})

// 判断 session 是否有效
router.get('/check', async (ctx) => {
  if (ctx.session?.isNew) {
    ctx.body = {
      error_code: '00',
      data: { res: { online: false } },
      error_msg: 'no',
    }
  } else {
    ctx.body = {
      error_code: '00',
      data: { res: { online: true } },
      error_msg: 'ok',
    }
  }
})

export default router.routes()
