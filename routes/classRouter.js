const express = require('express');
const router = express.Router();

const {
  registerClass,
  addclass,
  deleteclass,
  getallclass,
  getregisterclass,
  deleteStudentClass
} = require('../controllers/classController');  // Đường dẫn đúng với file controller của bạn
const { deleteStudent } = require('../controllers/studentController');

// Đăng ký lớp học cho sinh viên
router.post('/classes/register', registerClass);

// Thêm lớp mới
router.post('/add', addclass);


// Xoá lớp theo classId (tham số URL)
router.delete('/delete/:classId', deleteclass);

router.get("/classes",getallclass)
router.post('/getregisterclass', getregisterclass);
router.post('/classes/delete', deleteStudentClass);


module.exports = router;
