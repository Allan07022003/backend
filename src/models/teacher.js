const mongoose = require('mongoose');
const argon2 = require('argon2');

const TeacherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
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
  grade: {
    type: String,
    enum: ['2nd Grade', '3rd Grade', '4th Grade'],
    required: true,
  },
  role: {
    type: String,
    default: 'teacher', // Asignamos el rol de profesor
  },
  isTemporaryPassword: {
    type: Boolean,
    default: false,
  },
});

// Middleware para encriptar la contraseña antes de guardar
TeacherSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    this.password = await argon2.hash(this.password);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar contraseñas
TeacherSchema.methods.matchPassword = async function (enteredPassword) {
  return await argon2.verify(this.password, enteredPassword);
};

module.exports = mongoose.model('Teacher', TeacherSchema);
