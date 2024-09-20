const mongoose = require('mongoose');
const argon2 = require('argon2');

const StudentSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: false, 
  },
  lastName: {
    type: String,
    required: false, 
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
    required: false, 
  },
  grade: {
    type: String,
    required: false, 
  },
  registeredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: false, 
  },
}, { timestamps: true });

// Método para comparar contraseñas
StudentSchema.methods.matchPassword = async function(enteredPassword) {
  return await argon2.verify(this.password, enteredPassword);
};

module.exports = mongoose.model('Student', StudentSchema);
