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
- 7. 注意 node 的版本：node@16
- 8. 【部署】
  - 8.1 运行 <code>npm run build</code>
  - 8.2 将根路径的所有文件打包压缩，放至服务器上
  - 8.3 运行 <code>.bin</code> 下的生产环境的脚本即可

#### ISSUE

- 1. 【描述】<code>pm2</code> 直接运行 <code>src/server.ts</code> 文件启动不了。【方案】将 <code>ts</code> 文件先编译成 <code>js</code> 文件，后用 <code>pm2</code> 执行 <code>build/server.js</code> 启动服务：<code>sh ./bin/dev.sh</code>
- 2. 【描述】<code>pm2 watch</code> 选项没起作用，即使用 <code>tsc -w</code> 重新编译出 <code>./build</code>，watch 也没作用，pm2 不会重新启动服务。【方案】修改文件后手动重启服务：<code>sh ./bin/restart.sh</code>
