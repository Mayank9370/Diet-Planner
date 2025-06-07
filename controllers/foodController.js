const supabase = require('../config/supabaseClient')

exports.addFood = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('foods')
      .insert(req.body)
      .select();

    if (error) throw error;
    res.status(201).json(data[0]);

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getFoods = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('foods')
      .select('*');

    if (error) throw error;
    res.json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};