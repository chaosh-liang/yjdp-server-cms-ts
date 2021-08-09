const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const schema = new Schema(
  {
    name: String,
    icon_url: String,
    category_id: Schema.Types.ObjectId,
  },
  { timestamps: { createdAt: 'created_time', updatedAt: 'update_time' } }
);

module.exports = model('series', schema);
