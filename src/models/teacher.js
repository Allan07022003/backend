const mongoose = require('mongoose');
const argon2 = require('argon2'); // Asegúrate de haber instalado argon2

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
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
  }],
  isTemporaryPassword: {
    type: Boolean,
    default: false,
  },
});

// Middleware para encriptar la contraseña antes de guardar
TeacherSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    this.password = await argon2.hash(this.password.trim()); // Usa argon2 para hashear la contraseña
    next();
  } catch (err) {
    next(err);
  }
});

// Método para comparar contraseñas
TeacherSchema.methods.matchPassword = async function(enteredPassword) {
  const isMatch = await argon2.verify(this.password, enteredPassword.trim()); // Compara con argon2

  // Logs para depurar
  console.log('Contraseña ingresada:', enteredPassword);
  console.log('Contraseña almacenada:', this.password);
  console.log('¿Las contraseñas coinciden?', isMatch);

  return isMatch;
};

const Teacher = mongoose.models.Teacher || mongoose.model('Teacher', TeacherSchema);

module.exports = Teacher;
