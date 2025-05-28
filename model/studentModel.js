const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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

studentSchema.methods.comparePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

studentSchema.methods.setPassword = async function(newPassword) {
  const hash = await bcrypt.hash(newPassword, 10);
  this.password = hash;
};

module.exports = mongoose.model('Student', studentSchema);
