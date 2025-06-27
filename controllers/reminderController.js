const supabase = require('../config/supabaseClient');

// Add a new reminder
exports.addReminder = async (req, res) => {
  const { user_id, message, times, device_token, repeat_interval, reminder_type } = req.body;

  if (!user_id || !message || !times || !Array.isArray(times)) {
    return res.status(400).json({ error: 'Missing or invalid reminder fields.' });
  }

  const { data, error } = await supabase
    .from('reminders')
    .insert([{
      user_id,
      message,
      times,
      device_token,
      repeat_interval: repeat_interval || 'daily',
      reminder_type
    }])
    .select('*');

  if (error) {
    console.error('Error adding reminder:', error.message);
    return res.status(500).json({ error: error.message });
  }

  res.status(201).json({ message: 'Reminder added', data });
};

// Get all reminders
exports.getReminders = async (req, res) => {
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ error: 'user_id is required' });
  }

  const { data, error } = await supabase
    .from('reminders')
    .select('*')
    .eq('user_id', user_id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching reminders:', error.message);
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json({ message: 'Fetched reminders', data });
};

// Delete a reminder
exports.deleteReminder = async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from('reminders')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting reminder:', error.message);
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json({ message: 'Reminder deleted successfully' });
};
