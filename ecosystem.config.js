/*
 * @Author: Broli
 * @Email: broli.up.up.up@gmail.com
 * @Date: 2021-09-10 10:53:27
 * @LastEditors: Broli
 * @LastEditTime: 2021-09-10 15:51:19
 * @Description: pm2 的配置文件
 * @Description: 指定配置文件和环境启动：pm2 start ecosystem.config.js --env production
 */
module.exports = {
  apps: [
    {
      name: 'DADUDU_SERVER',
      script: './server.js',
      watch: true,
      ignore_watch: ['node_modules'],
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
