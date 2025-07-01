const express = require('express');
const router = express.Router();

const {
  registerClass,
  addclass,
  deleteclass,
  getallclass,
  getregisterclass,
  deleteStudentClass
} = require('../controllers/classController');  

router.post('/classes/register', registerClass);
router.post('/add', addclass);
router.delete('/delete/:classId', deleteclass);
router.get("/classes",getallclass)
router.post('/getregisterclass', getregisterclass);
router.post('/classes/delete', deleteStudentClass);


module.exports = router;
