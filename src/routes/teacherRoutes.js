const express = require('express');
const { getStudentsByTeacher, getStudentProgress } = require('../controllers/teacherController');
const protectTeacher = require('../middleware/authTeacherMiddleware'); // Middleware de autenticación para profesores

const router = express.Router();

// Panel de administración - Ruta protegida
router.get('/adminDashboard', protectTeacher, (req, res) => {
  // Lógica adicional si es necesario
  res.status(200).json({
    message: `Bienvenido al panel de administración, Profesor ${req.user.name}`,
    teacher: req.user, // Información del profesor autenticado
  });
});

// Otras rutas para los profesores
router.get('/students', protectTeacher, getStudentsByTeacher);
router.get('/students/:studentId/progress', protectTeacher, getStudentProgress);

module.exports = router;
