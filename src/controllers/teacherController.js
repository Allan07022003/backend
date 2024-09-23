const Teacher = require('../models/teacher');
const Student = require('../models/students');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Token = require('../models/Token'); 
const teacherService = require('../service/teacherService');
const studentService = require('../service/studentService'); 

// Obtener todos los estudiantes
const getAllStudents = async (req, res) => {
  try {
    const students = await studentService.getAllStudents();
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los estudiantes: ' + error.message });
  }
};

// Obtener estudiantes asignados al maestro
const getStudentsByTeacher = async (req, res) => {
  try {
    // ID del profesor autenticado
    const teacherId = req.user.id;
    const teacherGrade = req.user.grade; // Grado del profesor autenticado

    // Buscar los estudiantes que tienen asignado al profesor y que coincidan en el grado
    const students = await Student.find({
      registeredBy: teacherId,
      grade: teacherGrade
    }).select('firstName lastName email  grade age');

    // Devolver un array vacío si no hay estudiantes
    if (students.length === 0) {
      return res.status(200).json([]); // Devolver un array vacío
    }

    res.status(200).json(students);
  } catch (error) {
    console.error("Error al obtener los estudiantes asignados:", error);
    res.status(500).json({ message: 'Error al obtener los estudiantes asignados: ' + error.message });
  }
};


// Obtener el progreso de un estudiante específico
const getStudentProgress = async (req, res) => {
  try {
    const student = await Student.findById(req.params.studentId);

    if (!student) {
      return res.status(404).json({ message: 'Estudiante no encontrado' });
    }

    const teacher = await Teacher.findById(req.user.id);
    if (!teacher.students.includes(req.params.studentId)) {
      return res.status(403).json({ message: 'No tienes permiso para ver el progreso de este estudiante.' });
    }

    res.json(student.progress);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el progreso del estudiante: ' + error.message });
  }
};

// Crear un nuevo estudiante
const createStudent = async (req, res) => {
  try {
    // Hashear la contraseña antes de crear el estudiante
    const hashedPassword = await studentService.hashPassword(req.body.password);

    // Crear el nuevo estudiante, asegurándonos de agregar el 'registeredBy' con el ID del profesor autenticado
    const newStudentData = {
      ...req.body,
      password: hashedPassword, // Guardar la contraseña hasheada
      registeredBy: req.user.id, // Asigna el ID del profesor autenticado al campo registeredBy
      grade: req.user.grade // Asigna el grado del profesor al campo grade del estudiante
    };

    const newStudent = await studentService.createStudent(newStudentData);
    res.status(201).json(newStudent);
  } catch (error) {
    console.error("Error al crear el estudiante:", error);
    res.status(500).json({ message: 'Error al crear el estudiante: ' + error.message });
  }
};



// Actualizar un estudiante
const updateStudent = async (req, res) => {
  try {
    const { password, ...updateData } = req.body; // Excluir la contraseña

    // Si hay una nueva contraseña, la hasheamos
    if (password) {
      updateData.password = await studentService.hashPassword(password);
    }

    const updatedStudent = await Student.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.status(200).json(updatedStudent);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el estudiante: ' + error.message });
  }
};



// Eliminar un estudiante
const deleteStudent = async (req, res) => {
  try {
    await studentService.deleteStudent(req.params.id);
    res.status(200).json({ message: 'Estudiante eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el estudiante: ' + error.message });
  }
};

// Solicitar recuperación de contraseña para profesores
const requestPasswordResetTeacher = async (req, res) => {
  const { email } = req.body;

  try {
    const teacher = await teacherService.findTeacherByEmail(email);
    if (!teacher) {
      return res.status(404).json({ message: 'Correo no registrado' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = await teacherService.hashPassword(resetToken);
    const newToken = new Token({ token: hashedToken, userId: teacher._id, role: 'teacher' });
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

// Restablecer contraseña de profesores
const resetPasswordTeacher = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const storedToken = await Token.findOne({ token });
    if (!storedToken) {
      return res.status(400).json({ message: 'Token inválido o expirado' });
    }

    const teacher = await teacherService.findTeacherById(storedToken.userId);
    if (!teacher) {
      return res.status(404).json({ message: 'Profesor no encontrado' });
    }

    const hashedPassword = await teacherService.hashPassword(password);
    teacher.password = hashedPassword;
    await teacher.save();

    await storedToken.deleteOne();

    res.status(200).json({ message: 'Contraseña restablecida con éxito' });
  } catch (error) {
    res.status(500).json({ message: 'Error al restablecer la contraseña: ' + error.message });
  }
};

module.exports = {
  requestPasswordResetTeacher,
  resetPasswordTeacher,
  getAllStudents, // Método para obtener todos los estudiantes
  getStudentsByTeacher,
  getStudentProgress,
  createStudent,
  updateStudent,
  deleteStudent,
};
