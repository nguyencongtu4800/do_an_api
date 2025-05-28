const Attendance = require('../model/attendanceModel');  // Model Attendance
const Student = require('../model/studentModel');  // Model Student
const Schedule = require('../model/scheduleModel');  // Model Schedule

// Đăng ký điểm danh
const markAttendance = async (req, res) => {
  try {
    const { studentId, classId, sessionName, attendanceTime, photo } = req.body;

    // Kiểm tra xem tất cả các trường bắt buộc đã được cung cấp chưa
    if (!studentId || !classId || !sessionName || !attendanceTime || !photo) {
      return res.status(400).json({
        success: false,
        message: 'All fields must be filled',
      });
    }

    // Kiểm tra xem sinh viên có tồn tại trong cơ sở dữ liệu không
    const student = await Student.findOne({studentId: studentId});
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }

    // Kiểm tra xem buổi học và lớp học có tồn tại không
    const schedule = await Schedule.findOne({ classId:classId, sessionName: sessionName });
    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found for the provided classId and sessionId',
      });
    }

    // Tạo thông tin điểm danh mới
    const newAttendance = new Attendance({
      studentId,
      classId,
      sessionName,
      attendanceTime,
      photo,  // Đường dẫn đến ảnh của sinh viên khi quét khuôn mặt
    });

    // Lưu điểm danh vào cơ sở dữ liệu
    await newAttendance.save();

    // Trả về phản hồi thành công
    return res.status(200).json({
      success: true,
      message: 'Attendance marked successfully',
      attendance: newAttendance,  // Trả về thông tin điểm danh vừa lưu
    });

  } catch (error) {
    // Nếu có lỗi xảy ra trong quá trình xử lý, trả về thông báo lỗi
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
    });
  }
};


const historyAttendance= async (req, res) => {

    const {studentId} = req.body
  console.log("sv", studentId)
    try {
      
      const student = await Student.findOne({studentId: studentId});
      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Student not found',
        });
      }
  
      // Truy vấn điểm danh của sinh viên theo studentId
      const attendanceHistory = await Attendance.find({ studentId }).sort({ attendanceTime: -1 });
      
      // Nếu không có điểm danh nào
      if (attendanceHistory.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No attendance records found for this student',
        });
      }
  
      // Trả về lịch sử điểm danh
      return res.status(200).json({
        success: true,
        message: 'Attendance history fetched successfully',
        attendanceHistory,  // Trả về dữ liệu điểm danh của sinh viên
      });
    } catch (error) {
      // Xử lý lỗi trong trường hợp có lỗi
      console.error(error);
      return res.status(500).json({
        success: false,
        message: 'Server error. Please try again later.',
      });
    }
  };

  const addattendance= async (req, res) => {
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
        photo: photo || null // nếu không có thì để null
      });
  
      await newAttendance.save();
  
      res.status(201).json({ message: 'Điểm danh thành công', data: newAttendance });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  };

 const deletedAttendance= async (req, res) => {
  const _id=req.params.id
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

const historyAttendancebyClass =async (req, res) => {
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
