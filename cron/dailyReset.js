const cron = require("node-cron");
const supabase = require("../config/supabaseClient");

// Runs daily at 12:01 AM
cron.schedule("1 0 * * *", async () => {
  console.log("⏰ Daily food_log reset triggered...");

  const now = new Date();
  const today = now.toISOString().split("T")[0];

  const { data: users, error: userErr } = await supabase.from("user_profile").select("id");
  if (userErr) return console.error("User fetch error:", userErr.message);

  for (let user of users) {
    const { error: upsertErr } = await supabase.from("food_log")
      .upsert({
        user_id: user.id,
        date: today,
        total_calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0,
        water_intake: 0,
        sleep: 0,
        steps: 0
      }, { onConflict: ['user_id', 'date'] });

    if (upsertErr) {
      console.error(`Upsert error for user ${user.id}:`, upsertErr.message);
    }
  }

  console.log(`✅ Daily food_log upsert completed at ${now.toLocaleTimeString()}`);
});
