const router = require('@koa/router')();
const Users = require('../model/users');

router.post('/login', async ctx => {
  const { request: { body: { user_name, password } } } = ctx; // 参数
  const res = await Users.findOne({ user_name,  password });
  console.log('/login -> ', res);
  if (res) {
    console.log(ctx.session.isNew);
    let n = (ctx.session.views || 0);
    ctx.session.views = n++;
    ctx.body = { error_code: '00', data: null, error_msg: '登录成功' };
    ctx.response.status = 200;
  } else {
    ctx.body = { error_code: '00', data: null, error_msg: '登录失败' };
    ctx.response.status = 401;
  }
});

router.get('/logout', async ctx => {
  ctx.session = null;
  ctx.body = { error_code: '00', data: null, error_msg: '退出成功' };
});

module.exports = router.routes();
