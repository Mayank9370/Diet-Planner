const Food = require('../models/Food');

exports.generateDietPlan = async (req, res) => {
  try {
    const goal = (req.query.goal || '').toLowerCase();

    if (!['weight loss', 'maintenance', 'muscle gain'].includes(goal)) {
      return res.status(400).json({ error: 'Invalid goal. Use: weight loss, maintenance, muscle gain.' });
    }

    const allFoods = await Food.find();

    let selectedFoods = [];

    switch (goal) {
      case 'weight loss':
        selectedFoods = allFoods.filter(food => food.calories <= 200 && food.fat <= 10);
        break;
      case 'maintenance':
        selectedFoods = allFoods.filter(food => food.calories <= 400);
        break;
      case 'muscle gain':
        selectedFoods = allFoods.filter(food => food.protein >= 10);
        break;
    }

    const plan = selectedFoods.slice(0, 5); // Top 5 foods for the goal
    res.json({ goal, plan });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};