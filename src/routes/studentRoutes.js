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
const protect = require('../middleware/authMiddleware');

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

// estudiantes con profesor asignado
router.get('/students-with-teacher', protect, async (req, res) => {
  try {
    const students = await Student.find().populate('registeredBy', 'name email grade');
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener estudiantes con su profesor: ' + error.message });
  }
});


// Otras rutas
router.post(
  '/',
  protect,
  [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('age', 'La edad debe ser un número válido').isInt({ min: 6, max: 12 }),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  createStudent
);

router.get('/', protect, getStudents);
router.put('/:id', protect, updateStudent);
router.delete('/:id', protect, deleteStudent);

module.exports = router;
