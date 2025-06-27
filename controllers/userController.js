const supabase = require("../config/supabaseClient");

const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9
};

function calculateBMR(gender, weight, height, age) {
  if (gender === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
}

function calculateMacros(goal, calories) {
  if (goal === 'lose_weight') {
    return {
      protein: Math.round((calories * 0.4) / 4),
      carbs: Math.round((calories * 0.3) / 4),
      fats: Math.round((calories * 0.3) / 9)
    };
  } else if (goal === 'gain_muscle') {
    return {
      protein: Math.round((calories * 0.35) / 4),
      carbs: Math.round((calories * 0.45) / 4),
      fats: Math.round((calories * 0.2) / 9)
    };
  } else {
    // maintain_health
    return {
      protein: Math.round((calories * 0.3) / 4),
      carbs: Math.round((calories * 0.4) / 4),
      fats: Math.round((calories * 0.3) / 9)
    };
  }
}

exports.createUserProfile = async (req, res) => {
  try {
    const {
      age, weight, height, gender,
      activity_level, dietary_preference, fitness_goal
    } = req.body;

    const rawBMR = calculateBMR(gender, weight, height, age);
    const rawTDEE = rawBMR * ACTIVITY_MULTIPLIERS[activity_level];

    // Round BMR and TDEE before inserting
    const bmr = Math.round(rawBMR);
    const tdee = Math.round(rawTDEE);

    // Goal-based calorie adjustment
    let dailyCalories = tdee;
    if (fitness_goal === 'lose_weight') dailyCalories -= 500;
    else if (fitness_goal === 'gain_muscle') dailyCalories += 300;

    // Round daily calories too
    dailyCalories = Math.round(dailyCalories);

    const { protein, carbs, fats } = calculateMacros(fitness_goal, dailyCalories);
    const waterIntake = Math.round(weight * 35); // ml per kg

    // Step 1: Create user profile
    const { data: userData, error: userError } = await supabase
      .from('user_profile')
      .insert([{
        age, weight, height, gender, activity_level,
        dietary_preference, fitness_goal,
        bmr, tdee, daily_calories: dailyCalories,
        protein_target: protein,
        carbs_target: carbs,
        fats_target: fats,
        water_intake_goal: waterIntake
      }])
      .select()
      .single();

    if (userError) throw userError;

    // Step 2: Create default food log for today
    await supabase.from('food_log').insert([{
      user_id: userData.id
    }]);

    return res.status(201).json({
      message: 'User onboarded successfully',
      userId: userData.id,
      goals: {
        dailyCalories,
        protein, carbs, fats,
        waterIntake
      }
    });

  } catch (err) {
    console.error("Onboarding Error:", err);
    return res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
};