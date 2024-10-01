const express = require('express');
const { protect, teacherProtect } = require('../middleware/authMiddleware');
const {
  getStudentsByTeacher,
  getStudentProgress,
  requestPasswordResetTeacher,
  resetPasswordTeacher,
  createStudent,
  updateStudent,
  deleteStudent,
  getAllStudents 
} = require('../controllers/teacherController');

const router = express.Router();


router.get('/students/all', protect, teacherProtect, getAllStudents);

router.get('/students', protect, teacherProtect, getStudentsByTeacher);

router.post('/students/create', protect, teacherProtect, createStudent);

router.put('/students/:id', protect, teacherProtect, updateStudent);

router.delete('/students/:id', protect, teacherProtect, deleteStudent);

router.get('/students/:studentId/progress', protect, teacherProtect, getStudentProgress);

router.post('/password-reset', requestPasswordResetTeacher);

router.put('/reset-password/:token', resetPasswordTeacher);

module.exports = router;
