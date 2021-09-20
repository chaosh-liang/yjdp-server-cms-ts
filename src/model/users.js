const mongoose = require('mongoose');
const { Schema, model } = mongoose;

// Schema
const schema = new Schema(
  {
    _id: Schema.Types.ObjectId,
    user_name: String,
    password: String,
  },
  { timestamps: { createdAt: 'create_time', updatedAt: 'update_time' } }
);

module.exports = model('cmsusers', schema);
