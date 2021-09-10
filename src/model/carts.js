const mongoose = require('mongoose');
const { Schema, model } = mongoose;

// Schema
const schema = new Schema(
  {
    _id: Schema.Types.ObjectId,
    goods_id:Schema.Types.ObjectId,
    user_id: String,
    count: Number,
  },
  { timestamps: { createdAt: 'create_time', updatedAt: 'update_time' } }
);

module.exports = model('carts', schema);
