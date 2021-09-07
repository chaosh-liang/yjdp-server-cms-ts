const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const schema = new Schema(
  {
    name: String,
    desc: String,
    no: Number, // 序号
  },
  { timestamps: { createdAt: 'create_time', updatedAt: 'update_time' } }
);

module.exports = model('categories', schema);

/* {
  _id: 'a125342f145',
  name: '手机'
} */
