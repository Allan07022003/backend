const Student = require('../models/students');
const argon2 = require('argon2');
const Teacher = require('../models/teacher');

class StudentService {
  // Método para buscar un estudiante por su email
  async findStudentByEmail(email) {
    try {
      return await Student.findOne({ email });
    } catch (error) {
      throw new Error('Error al buscar el estudiante por email: ' + error.message);
    }
  }

  // Método para crear un estudiante
  async createStudent(data) {
    try {
      const student = new Student(data);
      return await student.save();
    } catch (error) {
      throw new Error('Error al crear el estudiante: ' + error.message);
    }
  }

  // Método para obtener todos los estudiantes
  async getAllStudents() {
    try {
      return await Student.find().populate('registeredBy', 'name email');
    } catch (error) {
      throw new Error('Error al obtener estudiantes: ' + error.message);
    }
  }

  // Método para actualizar un estudiante
  async updateStudent(id, data) {
    try {
      return await Student.findByIdAndUpdate(id, data, { new: true });
    } catch (error) {
      throw new Error('Error al actualizar el estudiante: ' + error.message);
    }
  }

  // Método para eliminar un estudiante
  async deleteStudent(id) {
    try {
      return await Student.findByIdAndDelete(id);
    } catch (error) {
      throw new Error('Error al eliminar el estudiante: ' + error.message);
    }
  }

  // Método para hashear la contraseña
  async hashPassword(password) {
    try {
      return await argon2.hash(password);
    } catch (error) {
      throw new Error('Error al hashear la contraseña: ' + error.message);
    }
  }

  // Método para verificar la contraseña
  async verifyPassword(enteredPassword, storedPassword) {
    try {
      return await argon2.verify(storedPassword, enteredPassword);
    } catch (error) {
      throw new Error('Error al verificar la contraseña: ' + error.message);
    }
  }

  // Método para buscar un estudiante por su ID
  async findStudentById(id) {
    try {
      return await Student.findById(id);
    } catch (error) {
      throw new Error('Error al buscar el estudiante por ID: ' + error.message);
    }
  }

  // Método para buscar un maestro por el grado
  async findTeacherByGrade(grade) {
    try {
      return await Teacher.findOne({ grade });
    } catch (error) {
      throw new Error('Error al buscar el maestro por grado: ' + error.message);
    }
  }
}

module.exports = new StudentService();
