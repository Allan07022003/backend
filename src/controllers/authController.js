const jwt = require('jsonwebtoken');
const argon2 = require('argon2');
const Teacher = require('../models/teacher');
const Student = require('../models/students');
const Token = require('../models/Token');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};


const loginUnificado = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await Student.findOne({ email });
    if (user) {
      console.log("Estudiante encontrado:", user.email);
      const isMatch = await user.matchPassword(password);
      console.log("Comparación de contraseñas para estudiante:", isMatch);
      if (isMatch) {
        const token = generateToken(user._id);
        console.log("Estudiante autenticado:", user.email);
        return res.status(200).json({ token, role: 'student' });
      } else {
        console.log("Contraseña incorrecta para estudiante");
      }
    }

    user = await Teacher.findOne({ email });
    if (user) {
      console.log("Profesor encontrado:", user.email);

      console.log("Contraseña ingresada:", password);
      console.log("Contraseña hasheada en DB:", user.password);

      const isMatch = await argon2.verify(user.password, password); 
      console.log("Resultado de la comparación:", isMatch);

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

const registerTeacherWithToken = async (req, res) => {
  const { token, name, password, grade } = req.body;

  try {
    const validToken = await Token.findOne({ token }); 

    if (!validToken) {
      return res.status(400).json({ message: 'Token no válido o expirado' });
    }

    const teacherExists = await Teacher.findOne({ email: validToken.email });
    if (teacherExists) {
      return res.status(400).json({ message: 'El profesor ya está registrado' });
    }

    const hashedPassword = await argon2.hash(password);
    const newTeacher = new Teacher({
      name,
      email: validToken.email,
      password: hashedPassword,
      grade,
    });

    await newTeacher.save();
    await validToken.deleteOne(); 

    res.status(201).json({ message: 'Profesor registrado con éxito' });
  } catch (error) {
    console.error('Error en el registro del profesor:', error);
    res.status(500).json({ message: 'Error al registrar al profesor' });
  }
};

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

const generateTokenForTeacherRegistration = async (req, res) => {
  const { email } = req.body;

  const token = crypto.randomBytes(32).toString('hex');
  const newToken = new Token({ token, email });

  try {
    await newToken.save(); 

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

const changeTemporaryPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  const teacher = await Teacher.findOne({ email });
  if (!teacher) {
    return res.status(404).json({ message: 'Profesor no encontrado' });
  }

  const hashedPassword = await argon2.hash(newPassword);
  teacher.password = hashedPassword;
  await teacher.save();

  res.json({ message: 'Contraseña actualizada correctamente' });
};

module.exports = {
  loginUnificado,
  registerTeacherWithToken,
  verifyToken,
  generateTokenForTeacherRegistration,
  changeTemporaryPassword,
};
