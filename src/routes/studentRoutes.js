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
const Student = require('../models/students');  

const router = express.Router();

router.post(
  '/register',
  [
    check('email', 'El correo electrónico es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria y debe tener al menos 6 caracteres').isLength({ min: 6 }),
  ],
  registerStudent
);

router.post(
  '/login',
  [
    check('email', 'El correo electrónico es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria y debe tener al menos 6 caracteres').isLength({ min: 6 }),
  ],
  loginStudent
);

router.post('/password-reset', requestPasswordResetStudent);

router.post('/reset-password/:token', resetPasswordStudent);

router.put('/complete-profile', protect, completeStudentProfile);

router.get('/profile-status', protect, async (req, res) => {
  try {
    const student = await Student.findById(req.user.id);

    if (!student) {
      return res.status(404).json({ message: 'Estudiante no encontrado' });
    }
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
    res.status(500).json({ message: 'Error al obtener el estado del perfil: ' + error.message });
  }
});

router.post('/create', protect, createStudent);

router.get('/', protect, getStudents);

router.put('/:id', protect, updateStudent);

router.delete('/:id', protect, deleteStudent);

module.exports = router;
