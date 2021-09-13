const router = require('@koa/router')();
const Users = require('../model/users');

router.post('/login', async ctx => {
  const { request: { body: { user_name, password } } } = ctx; // 参数
  try {
    const accountRes = await Users.findOne({ user_name });
    const res = await Users.findOne({ user_name,  password });
    if (!accountRes) {
      ctx.body = { error_code: '92', data: null, error_msg: '帐号不存在' };
    } else if (res) {
      let n = (ctx.session.views || 0);
      ctx.session.views = n++;
      ctx.body = { error_code: '00', data: null, error_msg: '登录成功' };
      ctx.response.status = 200;
    } else {
      ctx.body = { error_code: '93', data: null, error_msg: '帐号与密码不匹配' };
    }
  } catch (error) {
    console.log('/login error => ', error);
  }
});

router.get('/logout', async ctx => {
  ctx.session = null;
  ctx.body = { error_code: '00', data: null, error_msg: '退出成功' };
});

module.exports = router.routes();
