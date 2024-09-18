const express = require('express');
const { protect, teacherProtect } = require('../middleware/authMiddleware');
const { getStudentsByTeacher, getStudentProgress } = require('../controllers/teacherController');

const router = express.Router();

// Ruta protegida del admin dashboard solo para profesores
router.get('/adminDashboard', protect, teacherProtect, (req, res) => {
  res.status(200).json({
    message: `Bienvenido al panel de administración, Profesor ${req.user.name}`,
    teacher: req.user, // Información del profesor autenticado
  });
});

// Otras rutas para profesores
router.get('/students', protect, teacherProtect, getStudentsByTeacher);
router.get('/students/:studentId/progress', protect, teacherProtect, getStudentProgress);

module.exports = router;
