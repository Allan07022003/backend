const express = require('express');
const { 
  login, // Ruta unificada para el login
  registerTeacherWithToken, 
  verifyToken, 
  generateTokenForTeacherRegistration, 
  changeTemporaryPassword 
} = require('../controllers/authController');

const router = express.Router();

// Ruta para el login unificado
router.post('/login', loginUnificado);

// Ruta para registrar un profesor utilizando un token de invitación
router.post('/register', registerTeacherWithToken);

// Ruta para verificar un token JWT
router.get('/verify', verifyToken);

// Ruta para que un administrador genere un token de invitación para un nuevo profesor
router.post('/generate-token', generateTokenForTeacherRegistration);

// Ruta para que un profesor cambie su contraseña temporal
router.put('/change-password', changeTemporaryPassword);

module.exports = router;
