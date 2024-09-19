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
} = require('../controllers/studentController');
const Student = require('../models/students');
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

// Inicio de sesión de estudiantes
router.post(
  '/login',
  [
    check('email', 'El correo electrónico es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria y debe tener al menos 6 caracteres').isLength({ min: 6 }),
  ],
  loginStudent
);

// Completar el perfil del estudiante (requiere autenticación)
router.put('/complete-profile', protect, completeStudentProfile);

// Ruta para verificar el estado del perfil del estudiante
router.get('/profile-status', protect, async (req, res) => {
  try {
    const student = await Student.findById(req.user.id);

    if (!student) {
      return res.status(404).json({ message: 'Estudiante no encontrado' });
    }

    // Verificar que todos los campos estén completos
    const isComplete = student.firstName && student.lastName && student.age && student.grade;
    
    // Retornar el estado de completitud del perfil
    res.status(200).json({ isComplete: !!isComplete });
  } catch (error) {
    res.status(500).json({ message: 'Error al verificar el estado del perfil: ' + error.message });
  }
});

// estudiantes con profesor asignado
router.get('/students-with-teacher', protect, async (req, res) => {
  try {
    const students = await Student.find().populate('registeredBy', 'name email grade');
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener estudiantes con su profesor: ' + error.message });
  }
});

// Crear un nuevo estudiante (requiere autenticación)
router.post('/create', protect, createStudent);

// Obtener todos los estudiantes (requiere autenticación)
router.get('/', protect, getStudents);

console.log(typeof updateStudent);  // Esto debería mostrar 'function' en la consola

router.put('/:id', protect, updateStudent);

// Eliminar un estudiante (requiere autenticación)
router.delete('/:id', protect, deleteStudent);

module.exports = router;