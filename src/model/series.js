const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const schema = new Schema(
  {
    name: String,
    icon_url: String,
    no: Number, // 序号
    desc: String,
    category_id: Schema.Types.ObjectId,
  },
  { timestamps: { createdAt: 'create_time', updatedAt: 'update_time' } }
);

module.exports = model('series', schema);
