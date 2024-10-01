const express = require('express');
const { 
  loginUnificado,
  registerTeacherWithToken, 
  verifyToken, 
  generateTokenForTeacherRegistration, 
  changeTemporaryPassword 
} = require('../controllers/authController');

const router = express.Router();

router.post('/login', loginUnificado);

router.post('/register', registerTeacherWithToken);

router.get('/verify', verifyToken);

router.post('/generate-token', generateTokenForTeacherRegistration);

router.put('/change-password', changeTemporaryPassword);

module.exports = router;
