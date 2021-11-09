const mongoose = require('mongoose');
const { Schema, model } = mongoose;

// Schema
const schema = new Schema(
  {
    _id: Schema.Types.ObjectId,
    user_name: String,
    password: String,
    role: Number, // 1: root 2: admin 3: visitor
  },
  { timestamps: { createdAt: 'create_time', updatedAt: 'update_time' } }
);

module.exports = model('cmsusers', schema);
