const express = require('express');
const { protect, teacherProtect } = require('../middleware/authMiddleware');
const {
  getStudentsByTeacher,
  getStudentProgress,
  requestPasswordResetTeacher,
  resetPasswordTeacher,
  createStudent,
  updateStudent,
  deleteStudent,
  getAllStudents // Método para obtener todos los estudiantes
} = require('../controllers/teacherController');

const router = express.Router();

// Rutas CRUD para gestionar estudiantes desde el panel del profesor

// Obtener todos los estudiantes registrados en el sistema
router.get('/students/all', protect, teacherProtect, getAllStudents);

// Obtener los estudiantes asignados al profesor autenticado
router.get('/students', protect, teacherProtect, getStudentsByTeacher);

// Crear un nuevo estudiante
router.post('/students/create', protect, teacherProtect, createStudent);

// Actualizar un estudiante
router.put('/students/:id', protect, teacherProtect, updateStudent);

// Eliminar un estudiante
router.delete('/students/:id', protect, teacherProtect, deleteStudent);

// Obtener el progreso de un estudiante específico
router.get('/students/:studentId/progress', protect, teacherProtect, getStudentProgress);

// Solicitar la recuperación de contraseña para profesores (sin autenticación)
router.post('/password-reset', requestPasswordResetTeacher);

// Restablecer la contraseña de profesores con el token (sin autenticación)
router.put('/reset-password/:token', resetPasswordTeacher);

module.exports = router;
