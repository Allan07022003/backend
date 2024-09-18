const express = require('express');
const { 
  registerTeacherWithToken, 
  loginTeacher, 
  verifyToken, 
  generateTokenForTeacherRegistration, 
  changeTemporaryPassword 
} = require('../controllers/authController');

const router = express.Router();

// Ruta para registrar un profesor utilizando un token de invitación
router.post('/register', registerTeacherWithToken);

// Ruta para iniciar sesión como profesor
router.post('/login', loginTeacher);

// Ruta para verificar un token JWT
router.get('/verify', verifyToken);

// Ruta para que un administrador genere un token de invitación para un nuevo profesor
router.post('/generate-token', generateTokenForTeacherRegistration);

// Ruta para que un profesor cambie su contraseña temporal
router.put('/change-password', changeTemporaryPassword);

module.exports = router;
