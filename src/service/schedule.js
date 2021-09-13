const fs = require('fs');
const path = require('path');
const schedule = require('node-schedule');
const goodsModel = require('../model/goods');
const seriesModel = require('../model/series');

const PUBLIC_URL = 'dadudu_public';
const UPLOAD_URL = 'upload';
let fileDirectory = path.resolve(`D:\\${PUBLIC_URL}\\${UPLOAD_URL}`);

if (process.env.NODE_ENV === 'production') {
  fileDirectory = path.resolve(`/opt/material/server/${PUBLIC_URL}/${UPLOAD_URL}`);
}

// 清理没用的图片
const clearUselessPicture = async () => {
  const allGoods = await goodsModel.find();
  const allSeries = await seriesModel.find();
  const dbGoodsPicture = allGoods // 商品的图片
    .map((goods) => {
      const { icon_url, banner_url, desc_url } = goods;
      const [, icon_file_name] = icon_url.match(/upload\/(.+)/);
      const banner_file_name = banner_url
        .filter((url) => url) // 把为空的过滤掉
        .map((url) => url.match(/upload\/(.+)/)[1]) // 只要文件名
        .flat(); // 拉平
      const desc_file_name = desc_url
        .filter((url) => url)
        .map((url) => url.match(/upload\/(.+)/)[1])
        .flat();
      return [icon_file_name, ...banner_file_name, ...desc_file_name];
    })
    .flat();
  const dbSeriesPicture = allSeries // 系列的图片
    .map((series) => {
      const { icon_url } = series;
      const [, icon_file_name] = icon_url.match(/upload\/(.+)/);
      return icon_file_name;
    });
  const dbPictureSet = new Set([...dbGoodsPicture, ...dbSeriesPicture]);
  // console.log('dbPictureSet => ', dbPictureSet);
  fs.readdir(fileDirectory, (error, files) => {
    if (error) throw error;
    // console.log('files => ', files);
    const redundantFiles = files.filter((file) => !dbPictureSet.has(file)); // 多余的文件
    redundantFiles.forEach((file) => {
      fs.unlinkSync(path.join(fileDirectory, file), (error) => {
        if (error) console.log('删除文件失败：', file);
      });
    });
  });
};

const clearFileSchedule = () => {
  // 定时任务，日期和时间为： 每周一 01:00:00
  const job = schedule.scheduleJob(
    { hour: 1, minute: 0, second: 0, dayOfWeek: 1 },
    () => {
      /* // FIXME: 调试用
      const nextCron = job.nextInvocation(); // 返回下次的调用对象，如果被取消了，则返回 null
      if (nextCron) {
        const {
          _date: { ts },
        } = nextCron;
        console.log('下次清理日期和时间 => ', new Date(ts));
      } */
      clearUselessPicture(); // 清理没用的图片
    }
  );
};

module.exports = { clearFileSchedule };
