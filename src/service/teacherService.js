const Teacher = require('../models/teacher');
const argon2 = require('argon2');

class TeacherService {
  // Buscar un profesor por email
  async findTeacherByEmail(email) {
    try {
      return await Teacher.findOne({ email });
    } catch (error) {
      throw new Error('Error al buscar el profesor por email: ' + error.message);
    }
  }

  // Crear un profesor
  async createTeacher(data) {
    try {
      const teacher = new Teacher(data);
      return await teacher.save();
    } catch (error) {
      throw new Error('Error al crear el profesor: ' + error.message);
    }
  }

  // Obtener todos los profesores
  async getAllTeachers() {
    try {
      return await Teacher.find();
    } catch (error) {
      throw new Error('Error al obtener los profesores: ' + error.message);
    }
  }

  // Actualizar un profesor
  async updateTeacher(id, data) {
    try {
      return await Teacher.findByIdAndUpdate(id, data, { new: true });
    } catch (error) {
      throw new Error('Error al actualizar el profesor: ' + error.message);
    }
  }

  // Eliminar un profesor
  async deleteTeacher(id) {
    try {
      return await Teacher.findByIdAndDelete(id);
    } catch (error) {
      throw new Error('Error al eliminar el profesor: ' + error.message);
    }
  }

  // Hashear una contraseña
  async hashPassword(password) {
    try {
      return await argon2.hash(password);
    } catch (error) {
      throw new Error('Error al hashear la contraseña: ' + error.message);
    }
  }

  // Verificar una contraseña
  async verifyPassword(enteredPassword, storedPassword) {
    try {
      return await argon2.verify(storedPassword, enteredPassword);
    } catch (error) {
      throw new Error('Error al verificar la contraseña: ' + error.message);
    }
  }

  // Buscar un profesor por su ID
  async findTeacherById(id) {
    try {
      return await Teacher.findById(id);
    } catch (error) {
      throw new Error('Error al buscar el profesor por ID: ' + error.message);
    }
  }
}

module.exports = new TeacherService();
