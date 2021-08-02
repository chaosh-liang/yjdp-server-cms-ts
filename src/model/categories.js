const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const schema = new Schema({
  _id: Schema.Types.ObjectId,
  name: String
});

module.exports = model('categories', schema);

/* {
  _id: 'a125342f145',
  name: '手机'
} */
