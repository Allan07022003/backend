const express = require('express');
const { check, validationResult } = require('express-validator');
const {
  registerStudent,
  loginStudent,
  completeStudentProfile,
  createStudent,
  getStudents,
  updateStudent,
  deleteStudent,
  requestPasswordResetStudent,   
  resetPasswordStudent           
} = require('../controllers/studentController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Registro inicial para estudiantes (sin autenticación)
router.post(
  '/register',
  [
    check('email', 'El correo electrónico es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria y debe tener al menos 6 caracteres').isLength({ min: 6 }),
  ],
  registerStudent
);
// Inicio de sesión de estudiantes (sin autenticación)
router.post(
  '/login',
  [
    check('email', 'El correo electrónico es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria y debe tener al menos 6 caracteres').isLength({ min: 6 }),
  ],
  loginStudent
);

// Solicitar la recuperación de contraseña (sin autenticación)
router.post('/password-reset', requestPasswordResetStudent);

// Restablecer la contraseña usando el token de recuperación (sin autenticación)
router.post('/reset-password/:token', resetPasswordStudent);

// Completar el perfil del estudiante (requiere autenticación)
router.put('/complete-profile', protect, completeStudentProfile);

// Ruta para verificar el estado del perfil del estudiante (requiere autenticación)
router.get('/profile-status', protect, async (req, res) => {
  try {
    const student = await Student.findById(req.user.id);

    if (!student) {
      return res.status(404).json({ message: 'Estudiante no encontrado' });
    }
    
    // Verificamos si el perfil está completo
    const isProfileComplete = student.firstName && student.lastName && student.age && student.grade;
    res.status(200).json({
      isComplete: isProfileComplete,
      name: `${student.firstName} ${student.lastName}`,
      firstName: student.firstName,
      lastName: student.lastName,
      age: student.age,
      grade: student.grade
    });
  } catch (error) {
    console.error('Error en /profile-status:', error);  // Agregar este console.error para ver detalles del error
    res.status(500).json({ message: 'Error al obtener el estado del perfil: ' + error.message });
  }
});


// Crear un nuevo estudiante (requiere autenticación)
router.post('/create', protect, createStudent);

// Obtener todos los estudiantes (requiere autenticación)
router.get('/', protect, getStudents);

// Actualizar datos de un estudiante (requiere autenticación)
router.put('/:id', protect, updateStudent);

// Eliminar un estudiante (requiere autenticación)
router.delete('/:id', protect, deleteStudent);

module.exports = router;
