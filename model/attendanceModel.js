const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  studentId: { 
    type: String, 
    required: true 
    },                 // Mã sinh viên
  classId: { 
    type: String, 
    required: true 
    },                 // Mã lớp học
  sessionName: { 
    type: String, 
    required: true
    },               // Mã buổi học
  attendanceTime: { 
    type: Date, 
    required: true 
    },                // Thời gian điểm danh
  photo: { 
    type: String, 
    },                // Ảnh Base64 của khuôn mặt
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;
