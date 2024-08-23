const express = require('express');
const { getStudentsByTeacher, getStudentProgress } = require('../controllers/teacherController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

// Obtener estudiantes asignados al maestro
router.get('/students', protect, getStudentsByTeacher);

// Obtener el progreso de un estudiante específico
router.get('/students/:studentId/progress', protect, getStudentProgress);

module.exports = router;
