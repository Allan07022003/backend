const studentService = require('../service/studentService');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const Token = require('../models/Token'); 

const registerStudent = async (req, res) => {
  const { email, password } = req.body;

  try {
    let student = await studentService.findStudentByEmail(email);
    if (student) {
      return res.status(400).json({ message: 'El correo electrónico ya está registrado' });
    }

    const hashedPassword = await studentService.hashPassword(password);

    student = await studentService.createStudent({ email, password: hashedPassword });
    res.status(201).json({ message: 'Registro exitoso', student });
  } catch (error) {
    res.status(500).json({ message: 'Error en el registro: ' + error.message });
  }
};

const loginStudent = async (req, res) => {
  const { email, password } = req.body;

  try {
    const student = await studentService.findStudentByEmail(email);
    if (!student) {
      return res.status(400).json({ message: 'Credenciales incorrectas' });
    }

    const isMatch = await studentService.verifyPassword(password, student.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciales incorrectas' });
    }

    const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({ message: 'Login exitoso', token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const completeStudentProfile = async (req, res) => {
  try {
    const { firstName, lastName, age, grade } = req.body;
    const student = await studentService.findStudentById(req.user.id); 

    if (!student) {
      return res.status(404).json({ message: 'Estudiante no encontrado' });
    }

    let teacher;
    if (grade === '2nd Grade') {
      teacher = await studentService.findTeacherByGrade('2nd Grade');
    } else if (grade === '3rd Grade') {
      teacher = await studentService.findTeacherByGrade('3rd Grade');
    } else if (grade === '4th Grade') {
      teacher = await studentService.findTeacherByGrade('4th Grade');
    }
    student.firstName = firstName || student.firstName;
    student.lastName = lastName || student.lastName;
    student.age = age || student.age;
    student.grade = grade || student.grade;
    student.registeredBy = teacher ? teacher._id : student.registeredBy;

    await student.save();

    res.status(200).json({ message: 'Perfil completado con éxito', student });
  } catch (error) {
    res.status(500).json({ message: 'Error al completar el perfil: ' + error.message });
  }
};


const createStudent = async (req, res) => {
  const { password } = req.body;

  if (password.length < 6) {
    return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
  }

  try {
    const student = await studentService.createStudent(req.body);
    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getStudents = async (req, res) => {
  try {
    const students = await studentService.getAllStudents().select('-password'); 
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const updateStudent = async (req, res) => {
  try {
    const { password, ...updateData } = req.body; 

    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
      }
      updateData.password = await studentService.hashPassword(password);
    }

    const updatedStudent = await studentService.updateStudent(req.params.id, updateData);
    res.status(200).json(updatedStudent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const checkProfileStatus = async (req, res) => {
  try {
    const student = await studentService.findStudentById(req.user.id); 

    if (!student) {
      return res.status(404).json({ message: 'Estudiante no encontrado' });
    }

    const isComplete = student.firstName && student.lastName && student.age && student.grade;

    res.status(200).json({
      isComplete: isComplete,
      name: `${student.firstName} ${student.lastName}`,
      firstName: student.firstName,
      lastName: student.lastName,
      age: student.age,
      grade: student.grade
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al verificar el estado del perfil: ' + error.message });
  }
};

const deleteStudent = async (req, res) => {
  try {
    await studentService.deleteStudent(req.params.id);
    res.status(200).json({ message: 'Estudiante eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const requestPasswordResetStudent = async (req, res) => {
  const { email } = req.body;

  try {
    const student = await studentService.findStudentByEmail(email);
    if (!student) {
      return res.status(404).json({ message: 'Correo no registrado' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = await studentService.hashPassword(resetToken); 
    const newToken = new Token({ token: hashedToken, userId: student._id, role: 'student' });
    await newToken.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const message = `Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace para continuar: ${resetUrl}`;
    
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
      subject: 'Restablecimiento de Contraseña',
      text: message,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Correo de recuperación enviado' });
  } catch (error) {
    res.status(500).json({ message: 'Error enviando el correo de recuperación: ' + error.message });
  }
};

const resetPasswordStudent = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const storedToken = await Token.findOne({ token }); 
    if (!storedToken) {
      return res.status(400).json({ message: 'Token inválido o expirado' });
    }

    const student = await studentService.findStudentById(storedToken.userId);
    if (!student) {
      return res.status(404).json({ message: 'Estudiante no encontrado' });
    }

    const hashedPassword = await studentService.hashPassword(password);
    student.password = hashedPassword;
    await student.save();

    await storedToken.deleteOne();

    res.status(200).json({ message: 'Contraseña restablecida con éxito' });
  } catch (error) {
    res.status(500).json({ message: 'Error al restablecer la contraseña: ' + error.message });
  }
};

module.exports = {
  registerStudent,
  loginStudent,
  completeStudentProfile,
  requestPasswordResetStudent, 
  resetPasswordStudent,
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
};

