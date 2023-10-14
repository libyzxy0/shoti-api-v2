const mongoose = require('mongoose');
const videoSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
    unique: true
  },
  id: {
    type: String,
    required: true,
    unique: true
  },
  addedDate: {
    type: Date,
    required: true,
  },
});
module.exports = mongoose.model('Video', videoSchema);;