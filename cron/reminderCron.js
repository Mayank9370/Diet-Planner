const supabase = require('../config/supabaseClient');

const checkReminders = async () => {
  const now = new Date();
  const currentTime = now.toTimeString().slice(0, 5); // HH:MM
  const currentDay = now.getDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6

  const { data, error } = await supabase
    .from('reminders')
    .select('*');

  if (error) {
    console.error('Error fetching reminders:', error.message);
    return;
  }

  data.forEach(reminder => {
    const { times, repeat_interval, user_id, message } = reminder;

    if (!times.includes(currentTime)) return;

    const shouldTrigger =
      repeat_interval === 'daily' ||
      (repeat_interval === 'weekdays' && currentDay >= 1 && currentDay <= 5) ||
      (repeat_interval === 'weekends' && (currentDay === 0 || currentDay === 6)) ||
      (repeat_interval === 'weekly' && currentDay === 1); // e.g., every Monday

    if (shouldTrigger) {
      console.log(`🔔 [${reminder.reminder_type}] Reminder for user ${user_id}: ${message}`);
      // TODO: Add push/email here
    }
  });
};

module.exports = checkReminders;