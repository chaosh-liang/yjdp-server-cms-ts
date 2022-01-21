/**
 * 初始化就连接 mongodb
 */

import mongoose from 'mongoose'

const DB_URL = 'mongodb://lcs:up2021@localhost/dev'

export default {
  connect: () => {
    mongoose.connect(DB_URL)
    const db = mongoose.connection
    db.on('error', () => {
      console.log('mongodb connect Failed')
    })
    db.once('open', () => {
      console.log('mongodb connect success')
    })
  },
}
