const authService = require('../service/authService'); 

const registerTeacherWithToken = async (req, res) => {
  try {
    const { token, name, password, grade } = req.body;
    const authToken = await authService.registerTeacherWithToken({ token, name, password, grade });
    res.status(201).json({ token: authToken });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const generateTokenForTeacherRegistration = async (req, res) => {
  try {
    const { email } = req.body; 
    const token = await authService.generateTokenForTeacherRegistration(email);
    res.status(201).json({ message: 'Token generado y enviado al correo', token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const token = await authService.loginTeacher(req.body);
    res.status(200).json({ token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const verifyToken = async (req, res) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  try {
    const decoded = authService.verifyToken(token);
    res.status(200).json({ valid: true, decoded });
  } catch (error) {
    res.status(401).json({ valid: false, message: error.message });
  }
};

const changeTemporaryPassword = async (req, res) => {
  try {
    const { teacherId, newPassword } = req.body;
    await authService.changeTemporaryPassword(teacherId, newPassword);
    res.status(200).json({ message: 'Contraseña actualizada con éxito' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  registerTeacherWithToken,
  generateTokenForTeacherRegistration,
  login,
  verifyToken,
  changeTemporaryPassword,
};