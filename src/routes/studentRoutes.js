const express = require('express');
const { check, validationResult } = require('express-validator');
const { createStudent, getStudents, updateStudent, deleteStudent } = require('../controllers/studentController');
const protect = require('../middleware/authMiddleware');
const bcrypt = require('bcryptjs');
const Student = require('../models/students');
const Teacher = require('../models/teacher');

const router = express.Router();

// Registro inicial para estudiantes (sin autenticación)
router.post(
  '/register',
  [
    check('email', 'El correo electrónico es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria y debe tener al menos 6 caracteres').isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      
      let student = await Student.findOne({ email });
      if (student) {
        return res.status(400).json({ message: 'El correo electrónico ya está registrado' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      student = new Student({
        email,
        password: hashedPassword,
      });

      await student.save();
      res.status(201).json({ message: 'Registro exitoso', student });

    } catch (error) {
      res.status(500).json({ message: 'Error en el registro: ' + error.message });
    }
  }
);

// Completar el perfil del estudiante (requiere autenticación)
router.put(
  '/complete-profile',
  protect, // Middleware para verificar que el estudiante está autenticado
  async (req, res) => {
    try {
      const { name, age, grade } = req.body;
      const student = await Student.findById(req.user.id);

      if (!student) {
        return res.status(404).json({ message: 'Estudiante no encontrado' });
      }

      // Asignación automática de un maestro según el grado
      let teacher;
      if (grade === '2nd Grade') {
        teacher = await Teacher.findOne({ grade: '2nd Grade' });
      }
      // Puedes agregar más condiciones para otros grados en el futuro

      // Completar el perfil del estudiante
      student.name = name || student.name;
      student.age = age || student.age;
      student.grade = grade || student.grade;
      student.registeredBy = teacher ? teacher._id : null;

      await student.save();

      res.status(200).json({ message: 'Perfil completado con éxito', student });
    } catch (error) {
      res.status(500).json({ message: 'Error al completar el perfil: ' + error.message });
    }
  }
);

// Las rutas ya existentes que tienes configuradas
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
