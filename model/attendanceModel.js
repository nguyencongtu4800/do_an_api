const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true
  },               
  classId: {
    type: String,
    required: true
  },               
  sessionName: {
    type: String,
    required: true
  },           
  attendanceTime: {
    type: Date,
    required: true
  },             
  photo: {
    type: String,
  },     

  latitude: { type: Number },
  longitude: { type: Number},
  distance: { type: Number },
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;
