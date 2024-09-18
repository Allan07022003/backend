const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Teacher = require('../models/teacher');
const Student = require('../models/students');
const Token = require('../models/Token');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Función para generar un token JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const loginUnificado = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Intentar buscar el estudiante
    let user = await Student.findOne({ email });
    if (user) {
      console.log("Estudiante encontrado:", user.email);
      const isMatch = await user.matchPassword(password);  // Verificar la contraseña
      if (isMatch) {
        const token = generateToken(user._id);
        console.log("Estudiante autenticado:", user.email);
        return res.status(200).json({ token, role: 'student' });
      } else {
        console.log("Contraseña incorrecta para estudiante");
      }
    }

    // Intentar buscar el profesor
    user = await Teacher.findOne({ email });
    if (user) {
      console.log("Profesor encontrado:", user.email);
      const isMatch = await user.matchPassword(password);  // Verificar la contraseña
      if (isMatch) {
        const token = generateToken(user._id);
        console.log("Profesor autenticado:", user.email);
        return res.status(200).json({ token, role: 'teacher' });
      } else {
        console.log("Contraseña incorrecta para profesor");
      }
    }

    console.log('Credenciales incorrectas para', email);
    return res.status(401).json({ message: 'Credenciales incorrectas' });
  } catch (error) {
    console.error('Error en el inicio de sesión:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};


// Función para registrar un profesor con un token de invitación
const registerTeacherWithToken = async (req, res) => {
  const { token, name, password, grade } = req.body;

  try {
    const validToken = await Token.findOne({ token }); // Revisa si el token es válido en la DB

    if (!validToken) {
      return res.status(400).json({ message: 'Token no válido o expirado' });
    }

    const teacherExists = await Teacher.findOne({ email: validToken.email });
    if (teacherExists) {
      return res.status(400).json({ message: 'El profesor ya está registrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newTeacher = new Teacher({
      name,
      email: validToken.email,
      password: hashedPassword,
      grade,
    });

    await newTeacher.save();
    await validToken.deleteOne(); // Borra el token después del registro exitoso

    res.status(201).json({ message: 'Profesor registrado con éxito' });
  } catch (error) {
    console.error('Error en el registro del profesor:', error);
    res.status(500).json({ message: 'Error al registrar al profesor' });
  }
};

// Verificar un token JWT
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
  const { email } = req.body;

  // Generar un token único
  const token = crypto.randomBytes(32).toString('hex');
  const newToken = new Token({ token, email });

  try {
    await newToken.save(); // Almacenar el token y el email en la colección Token

    // Configuración de nodemailer para enviar el correo
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Invitación para unirse como profesor',
      text: `Utiliza este token para registrarte: ${token}`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Correo enviado a ${email} con el token de registro.`);
    res.status(200).json({ token });
  } catch (error) {
    console.error('Error enviando correo:', error);
    res.status(500).json({ message: 'Error generando el token o enviando el correo' });
  }
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

// Exportar todas las funciones necesarias
module.exports = {
  loginUnificado,
  registerTeacherWithToken,
  verifyToken,
  generateTokenForTeacherRegistration,
  changeTemporaryPassword,
 
};

