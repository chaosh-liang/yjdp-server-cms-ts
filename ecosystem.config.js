/*
 * @Author: Broli
 * @Email: broli.up.up.up@gmail.com
 * @Date: 2021-09-10 10:53:27
 * @LastEditors: Broli
 * @LastEditTime: 2021-09-17 12:21:14
 * @Description: pm2 的配置文件
 * @Description: 静态文件目录：开发环境（本地）D:\dadudu_public\upload
 * @Description: 静态文件目录：生产环境（线上）/opt/material/server/dadudu_public/upload
 * @Description: 启动服务：开发环境（默认开发环境） => pm2 start ecosystem.config.js
 * @Description: 启动服务：生产环境（须指定参数 --env production） => pm2 start ecosystem.config.js --env production
 */

const fs = require('fs');
const path = require('path');

const PUBLIC_URL = 'dadudu_public';
const UPLOAD_URL = 'upload';

// 默认本地路径
let publicAbsoluteDir = `D:\\${PUBLIC_URL}`;
let uploadAbsoluteDir = `D:\\${PUBLIC_URL}\\${UPLOAD_URL}`;

if (process.env.NODE_ENV === 'production') {
  publicAbsoluteDir = `/opt/material/server/${PUBLIC_URL}`;
  uploadAbsoluteDir = `/opt/material/server/${PUBLIC_URL}/${UPLOAD_URL}`;
}

const path_publicAbsoluteDir = path.resolve(publicAbsoluteDir);
const path_uploadAbsoluteDir = path.resolve(uploadAbsoluteDir);

// 判断嵌套的路径，须逐层判断和新建
if (!fs.existsSync(path_publicAbsoluteDir))
  fs.mkdirSync(path_publicAbsoluteDir);
if (!fs.existsSync(path_uploadAbsoluteDir))
  fs.mkdirSync(path_uploadAbsoluteDir);

module.exports = {
  apps: [
    {
      name: 'file_server',
      script: 'serve',
      env: {
        PM2_SERVE_PATH: path_publicAbsoluteDir, // 将 PUBLIC_URL 设置为静态文件目录，则可以直接读取目录下的文件。但直接访问 PUBLIC_URL 目录，不可见
        PM2_SERVE_PORT: 7715,
      },
    },
    {
      name: 'dadudu_server_cms',
      script: './server.js',
      watch: true,
      ignore_watch: ['node_modules'],
      env_development: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
