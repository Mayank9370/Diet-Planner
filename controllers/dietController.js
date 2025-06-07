const supabase = require('../config/supabaseClient')

exports.generateDietPlan = async (req, res) => {
  try {
    const goal = (req.query.goal || '').toLowerCase();

    if (!['weight loss', 'maintenance', 'muscle gain'].includes(goal)) {
      return res.status(400).json({ error: 'Invalid goal' });
    }

    let query = supabase.from('foods').select('*');

    switch (goal) {
      case 'weight loss':
        query = query.lte('calories', 200).lte('fat', 10);
        break;
      case 'maintenance':
        query = query.lte('calories', 400);
        break;
      case 'muscle gain':
        query = query.gte('protein', 10);
        break;
    }

    const { data: foods, error } = await query.limit(5);

    if (error) throw error;
    res.json({ goal, plan: foods });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};