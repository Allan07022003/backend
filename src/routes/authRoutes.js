const express = require('express');
const { 
  registerTeacherWithToken, 
  loginTeacher, 
  generateTokenForTeacherRegistration,
  verifyToken // Asegúrate de que esta función esté exportada correctamente en authController.js
} = require('../controllers/authController');

const router = express.Router();

// Ruta para registrar un profesor utilizando un token de invitación
router.post('/register', registerTeacherWithToken);

// Ruta para iniciar sesión como profesor
router.post('/login', loginTeacher);

// Ruta para generar un token de invitación para un nuevo profesor
router.post('/generate-token', generateTokenForTeacherRegistration);

// Ruta para verificar un token JWT (Asegúrate de que esta ruta esté bien definida y que la función `verifyToken` exista)
router.get('/verify', verifyToken);

module.exports = router;
