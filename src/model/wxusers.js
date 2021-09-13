const mongoose = require('mongoose');
const { Schema, model } = mongoose;

// Schema
const schema = new Schema(
  {
    _id: Schema.Types.ObjectId,
    session_key: String,
    open_id: String,
    avatar_url: String,
    city: String,
    country: String,
    gender: Number, // 0：未知，1：男，2：女
    nick_name: String,
    language: String,
    province: String,
  },
  { timestamps: { createdAt: 'create_time', updatedAt: 'update_time' } }
);

module.exports = model('users', schema);
