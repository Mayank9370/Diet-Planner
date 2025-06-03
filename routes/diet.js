const express = require('express');
const router = express.Router();
const dietController = require('../controllers/dietController');

router.get('/generate', dietController.generateDietPlan);

module.exports = router;
