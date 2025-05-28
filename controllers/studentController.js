const Student = require('../model/studentModel');
const bcrypt = require('bcryptjs');
const validator = require('validator');

// API Đăng ký Sinh Viên
const signup = async (req, res) => {
  const { studentId, cccd, fullName, password } = req.body;

  try {
    // Kiểm tra các trường đầu vào
    if (!studentId || !cccd || !fullName || !password) {
      throw Error('All fields must be filled');
    }

    // if (!validator.isStrongPassword(password)) {
    //   throw Error('Password not strong enough');
    // }

    // Kiểm tra xem sinh viên đã tồn tại chưa
    const exists = await Student.findOne({ $or: [{ studentId }, { cccd }] });
    if (exists) {
      throw Error('Student ID or CCCD already in use');
    }

    // Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // Tạo mới sinh viên
    const newStudent = new Student({
      studentId,
      cccd,
      fullName,
      password: hash
    });

    await newStudent.save();

    // Trả về thông tin sinh viên mới tạo
    res.status(201).json({
      success: true,
      message: 'Student registered successfully',
      student: {
        studentId: newStudent.studentId,
        cccd: newStudent.cccd,
        fullName: newStudent.fullName
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// API Đăng nhập Sinh Viên
const login = async (req, res) => {
  const { studentId, password } = req.body;

  try {
    // Kiểm tra thông tin đăng nhập
    if (!studentId || !password) {
      throw Error('All fields must be filled');
    }

    const student = await Student.findOne({ studentId });
    if (!student) {
      throw Error('Student not found');
    }

    // Kiểm tra mật khẩu
    const match = await bcrypt.compare(password, student.password);
    if (!match) {
      throw Error('Incorrect password');
    }

 

    res.status(200).json({
      success: true,
      message: 'Login successful',
      student: student, // Trả về thông tin sinh viên
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const changePassword= async (req, res) => {
  try {
    const { studentId, oldPassword, newPassword } = req.body;

    if (!studentId || !oldPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Thiếu thông tin bắt buộc' });
    }

    const student = await Student.findOne({ studentId });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Sinh viên không tồn tại' });
    }

    const isMatch = await student.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Mật khẩu cũ không đúng' });
    }

    await student.setPassword(newPassword);
    await student.save();

    return res.json({ success: true, message: 'Đổi mật khẩu thành công' });
  } catch (error) {
    console.error('Error in changePassword:', error);
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// const deleteStudent = async (req, res) => {
//   try {
  
//     const { studentId} = req.body;

//     if (!studentId ) {
//       return res.status(400).json({ success: false, message: 'Thiếu thông tin bắt buộc' });
//     }

//     const deleted = await Student.findOneAndDelete({ studentId });

//     if (!deleted) {
//       return res.status(404).json({ success: false, message: 'Sinh viên không tồn tại' });
//     }

//     if (!deleted) {
//       return res.status(404).json({ success: false, message: 'Sinh viên không tồn tại' });
//     }

//     return res.json({ success: true, message: 'Xoá sinh viên thành công' });
//   } catch (error) {
//     console.error('Lỗi khi xoá sinh viên:', error);
//     return res.status(500).json({ success: false, message: 'Lỗi server' });
//   }
// };

module.exports = {
    login,
    signup,
    changePassword,
    // deleteStudent

  };
  
