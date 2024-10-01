const Teacher = require('../models/teacher');
const argon2 = require('argon2');

class TeacherService {
  async findTeacherByEmail(email) {
    try {
      return await Teacher.findOne({ email });
    } catch (error) {
      throw new Error('Error al buscar el profesor por email: ' + error.message);
    }
  }

  async createTeacher(data) {
    try {
      const teacher = new Teacher(data);
      return await teacher.save();
    } catch (error) {
      throw new Error('Error al crear el profesor: ' + error.message);
    }
  }

  async getAllTeachers() {
    try {
      return await Teacher.find();
    } catch (error) {
      throw new Error('Error al obtener los profesores: ' + error.message);
    }
  }

  async updateTeacher(id, data) {
    try {
      return await Teacher.findByIdAndUpdate(id, data, { new: true });
    } catch (error) {
      throw new Error('Error al actualizar el profesor: ' + error.message);
    }
  }

  async deleteTeacher(id) {
    try {
      return await Teacher.findByIdAndDelete(id);
    } catch (error) {
      throw new Error('Error al eliminar el profesor: ' + error.message);
    }
  }

  async hashPassword(password) {
    try {
      return await argon2.hash(password);
    } catch (error) {
      throw new Error('Error al hashear la contraseña: ' + error.message);
    }
  }

  async verifyPassword(enteredPassword, storedPassword) {
    try {
      return await argon2.verify(storedPassword, enteredPassword);
    } catch (error) {
      throw new Error('Error al verificar la contraseña: ' + error.message);
    }
  }

  async findTeacherById(id) {
    try {
      return await Teacher.findById(id);
    } catch (error) {
      throw new Error('Error al buscar el profesor por ID: ' + error.message);
    }
  }
}

module.exports = new TeacherService();
