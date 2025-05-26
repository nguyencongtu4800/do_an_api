const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  studentId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  cccd: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  registeredClasses: {
    type: [String], // danh sách mã lớp học
    default: []
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Student', studentSchema);
