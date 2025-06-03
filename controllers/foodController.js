const Food = require('../models/Food');

exports.addFood = async (req, res) => {
  try {
    const food = new Food(req.body);
    await food.save();
    res.status(201).json(food);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getFoods = async (req, res) => {
  try {
    const query = req.query.search || '';
    const foods = await Food.find({ name: { $regex: query, $options: 'i' } });
    res.json(foods);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteFood = async (req, res) => {
  try {
    await Food.findByIdAndDelete(req.params.id);
    res.json({ message: 'Food deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
