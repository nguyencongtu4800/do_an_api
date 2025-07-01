const express = require('express');
const router = express.Router();

const {
  markAttendance,
  historyAttendance,
  addattendance,
  deletedAttendance,
  historyAttendancebyClass
} = require('../controllers/attendanceController');


router.post('/mark', markAttendance);
router.post('/history', historyAttendance);
router.post('/historybyclass', historyAttendancebyClass);
router.post('/add', addattendance);
router.delete('/delete/:id', deletedAttendance);

module.exports = router;
