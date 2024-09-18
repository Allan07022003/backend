const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Teacher = require('../models/teacher');
const Student = require('../models/Student');

// Función para generar un token JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Controlador para el inicio de sesión de estudiantes
const loginStudent = async (req, res) => {
  const { email, password } = req.body;

  const student = await Student.findOne({ email });

  if (student && (await bcrypt.compare(password, student.password))) {
    res.cookie('jwt', generateToken(student._id), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 días
    });

    res.json({
      _id: student._id,
      email: student.email,
      token: generateToken(student._id),
    });
  } else {
    res.status(401).json({ message: 'Credenciales incorrectas' });
  }
};

// Controlador para el inicio de sesión de profesores
const loginTeacher = async (req, res) => {
  const { email, password } = req.body;

  const teacher = await Teacher.findOne({ email });

  if (teacher && (await bcrypt.compare(password, teacher.password))) {
    const token = generateToken(teacher._id);

    // Enviar el token en una cookie
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 días
    });

    res.json({
      _id: teacher._id,
      email: teacher.email,
      role: 'teacher',
      token,
    });
  } else {
    res.status(401).json({ message: 'Credenciales incorrectas' });
  }
};

module.exports = { loginStudent, loginTeacher };