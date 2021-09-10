const mongoose = require('mongoose');
const { Schema, model } = mongoose;

// Schema
const schema = new Schema(
  {
    _id: Schema.Types.ObjectId,
    goods_id:Schema.Types.ObjectId,
    user_id: String,
    count: Number,
    status: Number, // 1：待付款，2：待发货，3：已完成
  },
  { timestamps: { createdAt: 'create_time', updatedAt: 'update_time' } }
);

module.exports = model('carts', schema);
