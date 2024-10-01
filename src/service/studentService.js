const Student = require('../models/students');
const argon2 = require('argon2');
const Teacher = require('../models/teacher');

class StudentService {
  async findStudentByEmail(email) {
    try {
      return await Student.findOne({ email });
    } catch (error) {
      throw new Error('Error al buscar el estudiante por email: ' + error.message);
    }
  }

  async createStudent(data) {
    try {
      const student = new Student(data);
      return await student.save();
    } catch (error) {
      throw new Error('Error al crear el estudiante: ' + error.message);
    }
  }

async getAllStudents() {
  try {
    return await Student.find().select('-password').populate('registeredBy', 'name email');
  } catch (error) {
    throw new Error('Error al obtener estudiantes: ' + error.message);
  }
}
  async updateStudent(id, data) {
    try {
      return await Student.findByIdAndUpdate(id, data, { new: true });
    } catch (error) {
      throw new Error('Error al actualizar el estudiante: ' + error.message);
    }
  }

  async deleteStudent(id) {
    try {
      return await Student.findByIdAndDelete(id);
    } catch (error) {
      throw new Error('Error al eliminar el estudiante: ' + error.message);
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

  async findStudentById(id) {
    try {
      return await Student.findById(id);
    } catch (error) {
      throw new Error('Error al buscar el estudiante por ID: ' + error.message);
    }
  }

  async findTeacherByGrade(grade) {
    try {
      return await Teacher.findOne({ grade });
    } catch (error) {
      throw new Error('Error al buscar el maestro por grado: ' + error.message);
    }
  }
}

module.exports = new StudentService();
