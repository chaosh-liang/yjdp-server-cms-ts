#### Introduction

- 1. 后台管理系统服务
- 2. <code>mongoose</code> 对应的 collection（数据表）命名须以 <code>s</code> 结尾，表示复数。或者在 Schema 中，<code>module.exports = model('modelName', schema, collectionName);</code> 带上 <code>collectionName</code> 参数
- 3. 本项目使用 <code>pm2</code> 管理服务进程。所以必须全局安装：<code>npm install pm2 -g</code>
- 4. 查看相关服务的日志，命令 <code>pm2 logs process_name|process_id</code>，更多关于<code>pm2</code>，学习请移步[官网](https://pm2.keymetrics.io/)
- 5. 启停服务
  - 5.1 命令启动：进入项目根路径，执行：<code>pm2 start ecosystem.config.js</code>，参见文件：<code>ecosystem.config.js</code> 中的描述
  - 5.2 脚本启动：进入<code>.bin</code>目录，windows 平台（powershell/cmd）执行命令 <code>.\env.bat</code>。Linux 平台执行命令 <code>sh env.sh</code>
  - 5.3 停止服务：命令行（全局）输入 <code>pm2 stop process_name|process_id</code> 或者进入<code>.bin</code>目录，运行对应脚本即可
  - 5.4 查看状态：命令行（全局）输入 <code>pm2 ls</code>，即可看到对应服务和状态
  - 5.5 一些说明：<code>env</code> 改为对应的环境名称。windows 中可用 <code>git bash</code> 运行 Linux 命令
- 6. 注意如果项目安装了依赖 <code>koa-static</code>，pm2 会与其冲突，无法启动服务
- 7. 开发环境，需要先执行命令 <code>npm run build</code> 以监听文件变化而重新编译生成 js 文件。再用 <code>pm2</code>启动服务。pm2 中的 watch 不生效，所以改动文件后，需要执行 <code>sh restart.sh</code> 重启服务。
  - 7.1 如果要实时调试和查看报错信息，直接用 <code>ts-node ./src/server.ts</code> 启动服务。
- 8. 生产环境，不需要执行 <code>npm run build</code>，直接启动服务即可 <code>sh pro.sh</code>
