const Student = require("../model/studentModel");
const Class = require("../model/classModel"); // Import model Class

const registerClass = async (req, res) => {
  try {
    const { studentId, classId } = req.body;

    if (!studentId || !classId) {
      return res.status(400).json({
        success: false,
        message: "studentId and classId are required",
      });
    }

    const student = await Student.findOne({ studentId });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const _class = await Class.findOne({ classId });
    if (!_class) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    if (student.registeredClasses.includes(classId)) {
      return res.status(400).json({
        success: false,
        message: "Class already registered",
      });
    }

    student.registeredClasses.push(classId);
    await student.save();

    return res.status(200).json({
      success: true,
      message: "Class registered successfully",
      registeredClasses: student.registeredClasses,
    });

  } catch (error) {
    console.error("Error registering class:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const addclass = async (req, res) => {
  try {
    const { classId, subjectId, subjectName } = req.body;


    if (!classId || !subjectId || !subjectName) {
      return res.status(400).json({ message: 'Thiếu thông tin lớp học.' });
    }

    // Tạo lớp mới
    const newClass = new Class({ classId, subjectId, subjectName });
    await newClass.save();

    res.status(201).json({ message: 'Thêm lớp thành công', data: newClass });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'classId đã tồn tại.' });
    }
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// Xoá lớp theo classId admin
const deleteclass = async (req, res) => {
  try {
    const classId = req.params;

    const deleted = await Class.findOneAndDelete({ classId });

    if (!deleted) {
      return res.status(404).json({ message: 'Không tìm thấy lớp để xoá.' });
    }

    res.json({ message: 'Xoá lớp thành công', data: deleted });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

const getallclass = async (req, res) => {
  try {
    const classes = await Class.find({});
    res.status(200).json(classes);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi lấy danh sách lớp học' });
  }
};

const getregisterclass = async (req, res) => {

  const { studentId } = req.body
  try {

    const student = await Student.findOne({ studentId: studentId });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    const classes = await Class.find({
      classId: { $in: student.registeredClasses }
    });

    return res.json({
      success: true,
      message: 'Classes fetched successfully',
      classes: classes,
    });

  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

const deleteStudentClass = async (req, res) => {
  try {
    const { studentId, classId } = req.body;

    if (!studentId || !classId) {
      return res.status(400).json({
        success: false,
        message: "studentId and classId are required",
      });
    }

    const student = await Student.findOne({ studentId });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    if (!student.registeredClasses.includes(classId)) {
      return res.status(400).json({
        success: false,
        message: "Class not found in student's registered classes",
      });
    }

    student.registeredClasses = student.registeredClasses.filter(id => id !== classId);

    await student.save();

    return res.status(200).json({
      success: true,
      message: "Class deleted successfully",
      registeredClasses: student.registeredClasses,
    });

  } catch (error) {
    console.error("Error deleting class:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  registerClass,
  addclass,
  deleteclass,
  getallclass,
  getregisterclass,
  deleteStudentClass
};
