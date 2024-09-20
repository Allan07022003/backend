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
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student' // Referencia a los estudiantes que pertenecen a este profesor
  }]
});

// Método para comparar contraseñas
TeacherSchema.methods.matchPassword = async function (enteredPassword) {
  return await argon2.verify(this.password, enteredPassword);
};

module.exports = mongoose.model('Teacher', TeacherSchema);
