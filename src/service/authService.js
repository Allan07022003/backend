const Teacher = require('../models/teacher');
const Token = require('../models/Token');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const argon2 = require('argon2');

class AuthService {
  async registerTeacherWithToken(data) {
    const { token, name, password, grade } = data;

    const validToken = await Token.findOne({ token });
    if (!validToken) {
      throw new Error('Token no válido o expirado');
    }

    const teacher = new Teacher({
      name,
      email: validToken.email.trim(),
      password: password.trim(), 
      grade,
      isTemporaryPassword: false,
    });

    await teacher.save();
    await validToken.deleteOne();

    return this.generateToken(teacher._id);
  }

  async generateTokenForTeacherRegistration(email) {
    const token = crypto.randomBytes(32).toString('hex');
    await new Token({ token, email: email.trim() }).save();

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
      logger: true, 
      debug: true,  
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email.trim(),
      subject: 'Este correo es para que pueda iniciar sesion en este link para poder gestionar la informacion de sus estudiantes asignados',
      text: `Use este enlace para registrarse: https://montessori-cabrican.vercel.app/login?token=${token}`,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`Correo enviado a ${email.trim()} con el token de registro.`);
    } catch (error) {
      console.error('Error enviando correo: ', error);
      throw new Error('Error enviando el correo de invitación.');
    }

    return token;
  }

  async loginTeacher(data) {
    const email = data.email.trim();
    const password = data.password.trim();

    const teacher = await Teacher.findOne({ email });
    if (!teacher) {
      throw new Error('Credenciales incorrectas');
    }

    const isMatch = await teacher.matchPassword(password); 
    if (!isMatch) {
      throw new Error('Credenciales incorrectas');
    }

    if (teacher.isTemporaryPassword) {
      throw new Error('Debe cambiar su contraseña antes de continuar');
    }

    return this.generateToken(teacher._id);
  }

  async changeTemporaryPassword(teacherId, newPassword) {
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) throw new Error('Profesor no encontrado');

    teacher.password = newPassword.trim(); 
    teacher.isTemporaryPassword = false;
    await teacher.save();
  }

  generateToken(id) {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
  }
}

module.exports = new AuthService();