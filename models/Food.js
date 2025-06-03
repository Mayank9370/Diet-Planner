const mongoose = require('mongoose');

const FoodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  calories: Number,
  protein: Number,
  carbs: Number,
  fat: Number,
});

module.exports = mongoose.model('Food', FoodSchema);