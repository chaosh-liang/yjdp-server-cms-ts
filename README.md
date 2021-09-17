#### ISSUE
  - 1. 后台管理系统服务
  - 2. <code>mongoose</code> 对应的 collection（数据表）命名须以 <code>s</code> 结尾，表示复数。或者在 Schema 中，<code>module.exports = model('modelName', schema, collectionName);</code> 带上 <code>collectionName</code> 参数
  - 3. 本项目使用 <code>pm2</code> 管理服务进程。所以必须全局安装：<code>npm install pm2 -g</code>
  - 4. 进入本项目根路径，启动服务：<code>pm2 start ecosystem.config.js</code>，参见文件：<code>ecosystem.config.js</code> 中的描述
  - 5. 注意如果项目安装了依赖 <code>koa-static</code>，pm2 会与其冲突，无法启动服务
  