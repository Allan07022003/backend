const jwt = require('jsonwebtoken');
const Teacher = require('../models/teacher');

const protectTeacher = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return res.status(401).json({ message: 'No se proporcionó un token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const teacher = await Teacher.findById(decoded.id).select('-password'); 

    if (!teacher) {
      return res.status(404).json({ message: 'Profesor no encontrado' });
    }

    req.user = teacher; 
    next(); 
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Token no válido' });
  }
};

module.exports = protectTeacher;