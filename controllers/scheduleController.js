const Schedule = require('../model/scheduleModel');
const Student = require('../model/studentModel'); 
const moment = require('moment'); 
const moment_time_zone = require('moment-timezone');

const getStudentWeeklySchedule = async (req, res) => {

  const { studentId } = req.body
  try {

    const student = await Student.findOne({ studentId: studentId });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    const registeredClassIds = student.registeredClasses;

    const vnTimeZone = 'Asia/Ho_Chi_Minh';

    const startOfWeek = moment_time_zone.tz(vnTimeZone).startOf('week').utc().toDate();
    const endOfWeek = moment_time_zone.tz(vnTimeZone).endOf('week').utc().toDate();

    const schedule = await Schedule.find({
      classId: { $in: registeredClassIds },
      startTime: { $gte: startOfWeek, $lte: endOfWeek } 
    }).sort({ startTime: 1 }); 


    res.status(200).json({
      success: true,
      message: 'Schedules fetched successfully',
      schedule: schedule
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

const addschedule = async (req, res) => {
  try {
    const { classId, sessionName, startTime, endTime } = req.body;

    if (!classId || !sessionName || !startTime || !endTime) {
      return res.status(400).json({ message: 'Thiếu thông tin buổi học.' });
    }

    const newSchedule = new Schedule({ classId, sessionName, startTime, endTime });
    await newSchedule.save();

    res.status(201).json({ message: 'Thêm buổi học thành công', data: newSchedule });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};


const deleteschedule = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Schedule.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: 'Không tìm thấy buổi học để xoá.' });
    }

    res.json({ message: 'Xoá buổi học thành công', data: deleted });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

const getallschedule = async (req, res) => {
  try {
    const schedules = await Schedule.find().sort({ startTime: 1 }); // sắp xếp theo thời gian bắt đầu

    res.json({
      message: 'Lấy toàn bộ danh sách buổi học thành công',
      data: schedules
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

const checkSchedule = async (req, res) => {
  const { studentId, classId, latitude, longitude } = req.body;

  const lat1 = Number(latitude)
  const lon1 = Number(longitude)
  console.log("vị trí ht", lat1, lon1)

  if (!studentId || !classId || latitude == null || longitude == null) {

    return res.status(400).json({
      isValidSchedule: false,
      message: 'Thiếu dữ liệu đầu vào.'
    });
  }

  const SCHOOL_LAT = parseFloat(process.env.SCHOOL_LAT);
  const SCHOOL_LNG = parseFloat(process.env.SCHOOL_LON);
  const MAX_DISTANCE = parseFloat(process.env.MAX_DISTANCE_METERS || 5000); // meters

  try {
    const now = new Date();
    const student = await Student.findOne({ studentId: studentId });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }


    if (!Array.isArray(student.registeredClasses)) {
      return res.status(400).json({ error: 'Trường registerClass không hợp lệ' });
    }
    
    if (!student.registeredClasses.includes(classId)) {
      return res.status(403).json({ error: 'Sinh viên chưa đăng ký lớp học này' });
    }

    const schedule = await Schedule.findOne({
      classId: classId,
      startTime: { $lte: now },  // startTime <= now
      endTime: { $gte: now }     // endTime >= now
    });

    if (!schedule) {
      return res.json({
        isValidSchedule: false,
        message: 'Không tìm thấy lịch học hợp lệ.'
      });
    }


    const distance = calculateDistance(lat1, lon1, SCHOOL_LAT, SCHOOL_LNG);
    console.log("kc", distance)
    if (distance > MAX_DISTANCE) {
      return res.json({
        isValidSchedule: false,
        message: 'Bạn không ở đúng khu vực điểm danh.',
        sessionnName: schedule.sessionName,
        distance: distance
      });
    }

    return res.json({
      isValidSchedule: true,
      message: 'Lịch học hợp lệ.',
      schedule: schedule,
      distance: distance
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      isValidSchedule: false,
      message: 'Lỗi server.'
    });
  }
};

module.exports = {
  getStudentWeeklySchedule,
  addschedule,
  deleteschedule,
  getallschedule,
  checkSchedule
};

function calculateDistance(lat1, lon1, lat2, lon2) {
  lat1 = parseFloat(lat1);
  lon1 = parseFloat(lon1);
  lat2 = parseFloat(lat2);
  lon2 = parseFloat(lon2);
  const R = 6371e3; // meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}
