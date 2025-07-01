const Attendance = require('../model/attendanceModel');  
const Student = require('../model/studentModel');  
const Schedule = require('../model/scheduleModel');  

// Gửi điểm danh
const markAttendance = async (req, res) => {
  try {
    const { studentId, classId, sessionName, attendanceTime, photo, latitude, longitude, distance } = req.body;

    if (!studentId || !classId || !sessionName || !attendanceTime || !photo) {
      return res.status(400).json({
        success: false,
        message: 'All fields must be filled',
      });
    }

    const student = await Student.findOne({ studentId: studentId });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }

    const schedule = await Schedule.findOne({ classId: classId, sessionName: sessionName });
    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found for the provided classId and sessionId',
      });
    }

    
    const newAttendance = new Attendance({
      studentId,
      classId,
      sessionName,
      attendanceTime,
      photo,
      latitude,
      longitude,
      distance
    });

    
    await newAttendance.save();

    return res.status(200).json({
      success: true,
      message: 'Attendance marked successfully',
      attendance: newAttendance, 
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
    });
  }
};

// Lịch sử all
const historyAttendance = async (req, res) => {

  const { studentId } = req.body
  console.log("sv", studentId)
  try {

    const student = await Student.findOne({ studentId: studentId });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }

    const registeredClasses = student.registeredClasses; 

    if (!registeredClasses || registeredClasses.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Student has not registered for any classes.',
      });
    }

    const attendanceHistory = await Attendance.find({
      studentId,
      classId: { $in: registeredClasses },
    }).sort({ attendanceTime: -1 });

  
    if (attendanceHistory.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No attendance records found for this student',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Attendance history fetched successfully',
      attendanceHistory,  
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
    });
  }
};

//admin
const addattendance = async (req, res) => {
  try {
    const { studentId, classId, sessionName, attendanceTime, photo } = req.body;

    // Kiểm tra thông tin bắt buộc
    if (!studentId || !classId || !sessionName || !attendanceTime) {
      return res.status(400).json({ message: 'Thiếu thông tin bắt buộc.' });
    }

    const newAttendance = new Attendance({
      studentId,
      classId,
      sessionName,
      attendanceTime: new Date(attendanceTime),
      photo: photo || null 
    });

    await newAttendance.save();

    res.status(201).json({ message: 'Điểm danh thành công', data: newAttendance });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

const deletedAttendance = async (req, res) => {
  const _id = req.params.id
  try {
    const result = await Attendance.findByIdAndDelete(_id);
    if (!result) {
      return res.status(404).json({ message: 'Không tìm thấy bản ghi điểm danh để xoá' });
    }
    res.json({ message: 'Xoá điểm danh thành công', deletedAttendance: result });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server khi xoá điểm danh', error: error.message });
  }
}

const historyAttendancebyClass = async (req, res) => {
  const { studentId, classId } = req.body;

  if (!studentId || !classId) {
    return res.status(400).json({ success: false, message: 'Thiếu studentId hoặc classCode' });
  }

  try {
    const attendanceHistory = await Attendance.find({ studentId, classId }).sort({ attendanceTime: -1 });

    res.json({
      success: true,
      message: 'Attendance history fetched successfully',
      attendanceHistory
    });
  } catch (error) {
    console.error('Lỗi lấy lịch sử điểm danh theo lớp:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};



module.exports = {
  markAttendance,
  historyAttendance,
  addattendance,
  deletedAttendance,
  historyAttendancebyClass
};
