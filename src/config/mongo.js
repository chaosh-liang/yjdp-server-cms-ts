/**
 * 初始化就连接 mongodb
 */

const mongoose = require('mongoose');

const DB_URL = 'mongodb://lcs:up2021@localhost/dev';
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

module.exports = {
  connect: () => {
    mongoose.connect(DB_URL, options);
    const db = mongoose.connection;
    db.on('error', () => {
      console.log('mongodb connect Failed');
    });
    db.once('open', () => {
      console.log('mongodb connect suucess');
    });

  }
};
