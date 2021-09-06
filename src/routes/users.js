const router = require('@koa/router')();
// const Users = require('../model/users');

router.get('/', async ctx => {
  ctx.body = 'get all users';
});

router.get('/:id', async ctx => {
  const { request: { query, body: params } } = ctx; // 参数
  console.log('query someone , params => ', params);
  console.log('query someone , query => ', query);
  ctx.body = { error_code: '00', add: 'test query' }; //这里为什么可以返回
});

router.post('/add', async ctx => {
  const params = ctx.request.body; // 参数
  /* User.create(params, (err, result) => {
    if (!err) {
      console.log('add result', result);
      ctx.body = { error_code: '00', add: 'ok' }; //TODO: 不能返回???
    }
  }); */
  ctx.body = { error_code: '00', add: 'ok111' }; //这里为什么可以返回
});

module.exports = router.routes();
