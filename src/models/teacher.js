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
    default: 'teacher', 
  },
  isTemporaryPassword: {
    type: Boolean,
    default: false,
  },
});

TeacherSchema.methods.matchPassword = async function (enteredPassword) {
  return await argon2.verify(this.password, enteredPassword);
};

module.exports = mongoose.model('Teacher', TeacherSchema);
