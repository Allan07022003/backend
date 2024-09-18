const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Teacher = require('../models/teacher');
const Token = require('../models/Token');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Función para generar un token JWT
const generateJwtToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// **Generar y enviar token de invitación para registrar profesor**
const generateTokenForTeacherRegistration = async (req, res) => {
  const { email } = req.body;

  // Generar un token único de invitación
  const token = crypto.randomBytes(32).toString('hex');

  // Almacenar el token en la base de datos
  await new Token({ token, email }).save();

  // Configurar nodemailer para enviar el correo
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Invitación para unirse como profesor',
    text: `Use este token para registrarse: ${token}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Correo enviado exitosamente', token });
  } catch (error) {
    res.status(500).json({ message: 'Error enviando el correo: ' + error.message });
  }
};

// **Registrar profesor usando el token de invitación**
const registerTeacherWithToken = async (req, res) => {
  const { token, name, password, grade } = req.body;

  try {
    // Verificar si el token es válido
    const validToken = await Token.findOne({ token });
    if (!validToken) {
      return res.status(400).json({ message: 'Token no válido o expirado' });
    }

    // Verificar si el profesor ya está registrado
    const teacherExists = await Teacher.findOne({ email: validToken.email });
    if (teacherExists) {
      return res.status(400).json({ message: 'El profesor ya está registrado' });
    }

    // Hashear la contraseña y registrar el profesor
    const hashedPassword = await bcrypt.hash(password, 10);
    const newTeacher = new Teacher({
      name,
      email: validToken.email,
      password: hashedPassword,
      grade,
    });

    await newTeacher.save();

    // Eliminar el token para evitar su reutilización
    await validToken.deleteOne();

    res.status(201).json({ message: 'Profesor registrado con éxito' });
  } catch (error) {
    res.status(500).json({ message: 'Error registrando profesor: ' + error.message });
  }
};

// **Login de profesores**
const loginTeacher = async (req, res) => {
  const { email, password } = req.body;

  const teacher = await Teacher.findOne({ email });
  if (!teacher) {
    return res.status(401).json({ message: 'Credenciales incorrectas' });
  }

  const isMatch = await teacher.matchPassword(password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Credenciales incorrectas' });
  }

  // Generar un token JWT y enviarlo en una cookie
  const token = generateJwtToken(teacher._id);
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 días
  });

  res.status(200).json({
    _id: teacher._id,
    email: teacher.email,
    role: 'teacher',
    token,
  });
};

// **Login de estudiantes**
const loginStudent = async (req, res) => {
  const { email, password } = req.body;

  const student = await Student.findOne({ email });
  if (!student) {
    return res.status(401).json({ message: 'Credenciales incorrectas' });
  }

  const isMatch = await bcrypt.compare(password, student.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Credenciales incorrectas' });
  }

  // Generar un token JWT y enviarlo en una cookie
  const token = generateJwtToken(student._id);
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    _id: student._id,
    email: student.email,
    token,
  });
};

module.exports = {
  loginStudent,
  loginTeacher,
  registerTeacherWithToken,
  generateTokenForTeacherRegistration,
};
