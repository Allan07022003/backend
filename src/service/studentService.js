const Student = require('../models/students');

class StudentService {
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
      return await Student.find().populate('registeredBy', 'name email');
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
}

module.exports = new StudentService();
