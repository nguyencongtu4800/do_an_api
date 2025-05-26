const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  classId: {
    type: String,
    required: true,
    trim: true
  },
  sessionName: {         //tuần 1/2
    type: String,
    required: true,
    trim: true
  },
  startTime: {
    type: Date,  // Lưu ngày và giờ (tự động lưu theo múi giờ UTC)
    required: true
  },
  endTime: {
    type: Date,  // Lưu ngày và giờ (tự động lưu theo múi giờ UTC)
    required: true
  }
}, {
  timestamps: true  // Tự động tạo trường createdAt và updatedAt
});

module.exports = mongoose.model('Schedule', scheduleSchema);
