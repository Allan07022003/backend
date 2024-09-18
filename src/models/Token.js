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
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600, // Expira en 1 hora
  }
});

module.exports = mongoose.model('Token', TokenSchema);
