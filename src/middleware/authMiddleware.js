const jwt = require('jsonwebtoken');
const Student = require('../models/students');
const Teacher = require('../models/teacher');

// Middleware para proteger rutas
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Busca al estudiante o profesor en la base de datos
      const student = await Student.findById(decoded.id).select('-password');
      const teacher = await Teacher.findById(decoded.id).select('-password');

      if (!student && !teacher) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      req.user = student || teacher; // Asigna toda la información del estudiante o profesor al request
      next(); // Continua al siguiente middleware o controlador
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Token no válido' });
    }
  } else {
    res.status(401).json({ message: 'No se proporcionó un token' });
  }
};

// Middleware para verificar si el usuario es profesor
const teacherProtect = (req, res, next) => {
  if (req.user && req.user.role === 'teacher') {
    next();
  } else {
    res.status(403).json({ message: 'Acceso denegado: No eres un profesor' });
  }
};

module.exports = { protect, teacherProtect };
