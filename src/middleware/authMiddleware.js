const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  let token;

  // Verifica si el token está en el header Authorization
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extrae el token
      token = req.headers.authorization.split(' ')[1];

      // Verifica y decodifica el token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Agrega el ID del usuario decodificado al request
      req.user = decoded.id;

      next(); // Pasa al siguiente middleware o controlador
    } catch (error) {
      res.status(401).json({ message: 'Token no válido' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'No se proporcionó un token' });
  }
};

module.exports = protect;
