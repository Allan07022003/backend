const Teacher = require('../models/teacher');
const Student = require('../models/students');

// Obtener estudiantes asignados al maestro
const getStudentsByTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.user.id).populate('students', 'name email grade progress');

    if (!teacher) {
      return res.status(404).json({ message: 'Maestro no encontrado' });
    }

    // Verifica si el profesor tiene estudiantes asignados
    if (teacher.students.length === 0) {
      return res.status(200).json({ message: 'No tienes estudiantes asignados.' });
    }

    res.json(teacher.students);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los estudiantes asignados: ' + error.message });
  }
};

// Obtener el progreso de un estudiante específico
const getStudentProgress = async (req, res) => {
  try {
    const student = await Student.findById(req.params.studentId);

    if (!student) {
      return res.status(404).json({ message: 'Estudiante no encontrado' });
    }

    // Opcional: Verifica si el profesor tiene permiso para ver el progreso de este estudiante
    const teacher = await Teacher.findById(req.user.id);
    if (!teacher.students.includes(req.params.studentId)) {
      return res.status(403).json({ message: 'No tienes permiso para ver el progreso de este estudiante.' });
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
