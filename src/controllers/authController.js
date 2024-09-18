const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Teacher = require('../models/teacher');
const Student = require('../models/students');

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

// Función para registrar un profesor con un token de invitación
const registerTeacherWithToken = async (req, res) => {
  const { token, email, password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const teacherExists = await Teacher.findOne({ email });
    if (teacherExists) {
      return res.status(400).json({ message: 'El profesor ya está registrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newTeacher = new Teacher({
      email,
      password: hashedPassword,
      registeredBy: decoded.id, // Quien generó el token
    });

    await newTeacher.save();
    res.status(201).json({ message: 'Profesor registrado con éxito' });
  } catch (error) {
    res.status(400).json({ message: 'Token no válido' });
  }
};

// Función para verificar un token JWT
const verifyToken = (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ valid: true, decoded });
  } catch (error) {
    res.status(401).json({ message: 'Token inválido' });
  }
};

// Función para generar un token de invitación para un nuevo profesor
const generateTokenForTeacherRegistration = async (req, res) => {
  const { teacherId } = req.body;
  const token = generateToken(teacherId);
  res.json({ token });
};

// Función para cambiar una contraseña temporal
const changeTemporaryPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  const teacher = await Teacher.findOne({ email });
  if (!teacher) {
    return res.status(404).json({ message: 'Profesor no encontrado' });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  teacher.password = hashedPassword;
  await teacher.save();

  res.json({ message: 'Contraseña actualizada correctamente' });
};

// Exportar todas las funciones
module.exports = { 
  loginStudent, 
  loginTeacher, 
  registerTeacherWithToken, 
  verifyToken, 
  generateTokenForTeacherRegistration, 
  changeTemporaryPassword 
};
