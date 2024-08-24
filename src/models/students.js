const mongoose = require('mongoose');
const argon2 = require('argon2');

const StudentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false, // Cambiado a no obligatorio
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    min: [6, 'La edad mínima es 6 años'],
    required: false, // Cambiado a no obligatorio
  },
  grade: {
    type: String,
    required: false, // Cambiado a no obligatorio
  },
  registeredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: false, // Cambiado a no obligatorio
  },
}, { timestamps: true });

// Método para comparar contraseñas
StudentSchema.methods.matchPassword = async function(enteredPassword) {
  return await argon2.verify(this.password, enteredPassword);
};

module.exports = mongoose.model('Student', StudentSchema);
