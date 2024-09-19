const studentService = require('../service/studentService');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

// Registro de estudiante
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

// Inicio de sesión de estudiante
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

    // Generar un token JWT
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
    const student = await studentService.findStudentById(req.user.id); // Obtiene el estudiante autenticado

    if (!student) {
      return res.status(404).json({ message: 'Estudiante no encontrado' });
    }

    // Asignación automática de un maestro según el grado
    let teacher;
    if (grade === '2nd Grade') {
      teacher = await studentService.findTeacherByGrade('2nd Grade');
    } else if (grade === '3rd Grade') {
      teacher = await studentService.findTeacherByGrade('3rd Grade');
    } else if (grade === '4th Grade') {
      teacher = await studentService.findTeacherByGrade('4th Grade');
    }

    // Completar el perfil del estudiante
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



// Otras funciones del controlador
const createStudent = async (req, res) => {
  try {
    const student = await studentService.createStudent(req.body);
    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getStudents = async (req, res) => {
  try {
    const students = await studentService.getAllStudents();
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateStudent = async (req, res) => {
  try {
    const updatedStudent = await studentService.updateStudent(req.params.id, req.body);
    res.status(200).json(updatedStudent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const checkProfileStatus = async (req, res) => {
  try {
    const student = await studentService.findStudentById(req.user.id); // Obtiene el estudiante autenticado

    if (!student) {
      return res.status(404).json({ message: 'Estudiante no encontrado' });
    }

    // Verifica si los campos necesarios están completos
    const isComplete = student.firstName && student.lastName && student.age && student.grade;

    res.status(200).json({ isComplete });
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

module.exports = {
  registerStudent,
  loginStudent,
  completeStudentProfile,
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
};

