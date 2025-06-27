const express = require('express');
const router = express.Router();
const reminderController = require('../controllers/reminderController');

router.post('/reminders', reminderController.addReminder);
router.get('/reminders', reminderController.getReminders); // query param ?user_id=...
router.delete('/reminders/:id', reminderController.deleteReminder);

module.exports = router;