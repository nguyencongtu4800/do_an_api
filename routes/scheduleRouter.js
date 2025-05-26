const express = require('express');
const router = express.Router();

const {
  getStudentWeeklySchedule,
  addschedule,
  deleteschedule,
  getallschedule,
  checkSchedule
} = require('../controllers/scheduleController'); // Đường dẫn đúng với file controller của bạn

// Lấy lịch học tuần của sinh viên theo studentId (truyền params)
router.post('/weekly', getStudentWeeklySchedule);

// Thêm buổi học mới
router.post('/add', addschedule);

// Xoá buổi học theo id (_id của MongoDB)
router.delete('/delete/:id', deleteschedule);

// Lấy tất cả buổi học không phân biệt lớp
router.get('/all', getallschedule);
router.post('/checkSchedule',checkSchedule)


module.exports = router;
