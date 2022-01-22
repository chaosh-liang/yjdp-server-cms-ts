/**
 * 初始化就连接 mongodb
 */

import { connect as mongooseConnect } from 'mongoose'

const DB_URL = 'mongodb://lcs:up2021@localhost/dev'

export default {
  connect: () => {
    mongooseConnect(DB_URL)
      .then(() => {
        console.log('[MongoDB connection] SUCCESS')
      })
      .catch((error) => {
        console.log('[MongoDB connection] ERROR: ', error)
      })
  },
}
