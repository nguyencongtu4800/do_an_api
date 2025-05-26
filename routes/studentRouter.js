const express = require("express");

//controller fundtions

const {
  login,
  signup,
} = require("../controllers/studentController");

const router = express.Router();


router.post("/login", login);


router.post("/register", signup);




module.exports = router;
