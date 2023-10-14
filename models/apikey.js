const mongoose = require('mongoose');
const apikeySchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  apikey: {
    type: String,
    required: true,
    unique: true
  },
  requests: {
    type: Number,
    required: true,
    unique: false
  },
  createdAt: {
    type: Date,
    required: true,
  },
});
module.exports = mongoose.model('Apikey', apikeySchema);