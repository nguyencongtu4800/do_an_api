const express = require("express");

//controller fundtions

const {
  login,
  signup,
  changePassword,
  deleteStudent,
} = require("../controllers/studentController");

const router = express.Router();


router.post("/login", login);
router.post("/register", signup);
router.post("/changePassword", changePassword);
// router.delete("/deletestudent", deleteStudent);




module.exports = router;
