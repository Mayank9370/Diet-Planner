const express = require('express');
const router = express.Router();
const foodController = require('../controllers/foodController');

router.post('/add', foodController.addFood);
router.get('/search', foodController.getFoods);
router.delete('/:id', foodController.deleteFood);

module.exports = router;