const jwt = require('jsonwebtoken');
const Student = require('../models/students');
const Teacher = require('../models/teacher');

// Middleware para proteger rutas
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1]; // Obtener el token
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verificar el token

      // Buscar en la base de datos si es un estudiante o profesor
      const student = await Student.findById(decoded.id).select('-password');
      const teacher = await Teacher.findById(decoded.id).select('-password');

      if (!student && !teacher) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      req.user = student || teacher; // Asigna la información del estudiante o profesor a req.user
      next();
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
    next(); // Continúa si es profesor
  } else {
    res.status(403).json({ message: 'Acceso denegado: No eres un profesor' });
  }
};

module.exports = { protect, teacherProtect };
