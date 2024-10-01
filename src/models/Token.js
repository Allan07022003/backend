const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'role', 
  },
  role: {
    type: String,
    required: true,
    enum: ['student', 'teacher'], 
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600, 
  }
});

module.exports = mongoose.model('Token', TokenSchema);
