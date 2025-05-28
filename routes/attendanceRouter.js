const express = require('express');
const router = express.Router();

const {
  markAttendance,
  historyAttendance,
  addattendance,
  deletedAttendance,
  historyAttendancebyClass
} = require('../controllers/attendanceController');

// Đăng ký điểm danh (submit điểm danh)
router.post('/mark', markAttendance);

// Lấy lịch sử điểm danh của sinh viên theo studentId
router.post('/history', historyAttendance);

router.post('/historybyclass', historyAttendancebyClass);

// Thêm điểm danh thủ công (dữ liệu attendance)
router.post('/add', addattendance);


router.delete('/delete/:id', deletedAttendance);

module.exports = router;
