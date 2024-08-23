const Teacher = require('../models/teacher');
const Student = require('../models/students');

// Obtener estudiantes asignados al maestro
const getStudentsByTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.user.id).populate('students', 'name email grade progress');

    if (!teacher) {
      return res.status(404).json({ message: 'Maestro no encontrado' });
    }

    res.json(teacher.students);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los estudiantes: ' + error.message });
  }
};

// Obtener el progreso de un estudiante específico
const getStudentProgress = async (req, res) => {
  try {
    const student = await Student.findById(req.params.studentId);

    if (!student) {
      return res.status(404).json({ message: 'Estudiante no encontrado' });
    }

    res.json(student.progress);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el progreso del estudiante: ' + error.message });
  }
};

module.exports = {
  getStudentsByTeacher,
  getStudentProgress,
};
