module.exports = async (ctx, done) => {
  // ignore login
  const {
    path,
    session: { isNew },
  } = ctx;
  // console.log('path => ', path);
  if (isNew) ctx.response.status = 401;
  await done();
};
