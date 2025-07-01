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
    trim: true,
  },
  startTime: {
    type: Date,  
    required: true
  },
  endTime: {
    type: Date,  
    required: true
  }
}, {
  timestamps: true  
});


module.exports = mongoose.model('Schedule', scheduleSchema);
