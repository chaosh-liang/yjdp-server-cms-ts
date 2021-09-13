
module.exports = ctx => {
  // ignore login
  const {
    path,
    session: { isNew },
  } = ctx;
  // console.log('path => ', path);
  if (isNew) ctx.response.status = 401;
}
