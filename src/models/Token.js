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
    refPath: 'role', // Relación dinámica que usa el campo "role" para decidir la colección
  },
  role: {
    type: String,
    required: true,
    enum: ['student', 'teacher'], // Definimos que el token puede pertenecer a un estudiante o profesor
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600, // Expira en 1 hora
  }
});

module.exports = mongoose.model('Token', TokenSchema);
