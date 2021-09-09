const fs = require('fs');
const path = require('path');
const schedule = require('node-schedule');
const goodsModel = require('../model/goods');

const public_url = 'public';
const upload_url = 'upload';
const fileDirectory = path.join(__dirname, '../../', public_url, upload_url);

// 清理没用的图片
const clearUselessPicture = async () => {
  const allGoods = await goodsModel.find({});
  const dbPictureSet = new Set(
    allGoods // 数据库中的所有图片
      .map((goods) => {
        const { icon_url, banner_url, desc_url } = goods;
        const [icon_file_name] = icon_url.match(/(\w+)\.(png|jpe?g|webp)$/g);
        const banner_file_name = banner_url
          .filter((url) => url) // 把为空的过滤掉
          .map((url) => url.match(/(\w+)\.(png|jpe?g|webp)$/g)) // 只要文件名
          .flat(); // 拉平
        const desc_file_name = desc_url
          .filter((url) => url)
          .map((url) => url.match(/(\w+)\.(png|jpe?g|webp)$/g))
          .flat();
        return [icon_file_name, ...banner_file_name, ...desc_file_name];
      })
      .flat()
  );
  // console.log('dbPictureSet => ', dbPictureSet);
  fs.readdir(fileDirectory, (error, files) => {
    if (error) throw error;
    // console.log('files => ', files);
    const redundantFiles = files.filter((file) => !dbPictureSet.has(file)); // 多余的文件
    redundantFiles.forEach((file) => {
      fs.unlinkSync(
        path.join(fileDirectory, file),
        (error) => {
          if (error) console.log('删除文件失败：', file);
        }
      );
    });
  });
};

const clearFileSchedule = () => {
  // 定时任务，日期和时间为： 每周日 00:00:10
  const job = schedule.scheduleJob(
    { hour: 0, minute: 0, second: 10, dayOfWeek: 0 },
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
