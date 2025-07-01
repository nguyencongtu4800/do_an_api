const express = require('express');
const router = express.Router();

const {
  getStudentWeeklySchedule,
  addschedule,
  deleteschedule,
  getallschedule,
  checkSchedule
} = require('../controllers/scheduleController'); 

router.post('/weekly', getStudentWeeklySchedule);

router.post('/add', addschedule);

router.delete('/delete/:id', deleteschedule);

router.get('/all', getallschedule);
router.post('/checkSchedule',checkSchedule)


module.exports = router;
