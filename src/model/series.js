const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const schema = new Schema({
  _id: Schema.Types.ObjectId,
  name: String,
  icon_url: String,
  category_id: Schema.Types.ObjectId
});

module.exports = model('series', schema);
