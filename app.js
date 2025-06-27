require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

const userRoutes = require('./routes/userRoutes');
const foodLogRoutes = require('./routes/foodLogRoutes');
const reminderRoutes = require('./routes/reminderRoutes');
const checkReminders = require('./cron/reminderCron');


app.use(cors({ origin: 'http://localhost:5173' }));

//Routes
app.use(express.json());
app.use('/api/user', userRoutes);
app.use('/api/food-log', foodLogRoutes);
app.use('/reminders', reminderRoutes);


require("./cron/dailyReset");
// Run cron job every minute
setInterval(checkReminders, 60 * 1000); //callback is a function

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



//To check Connection
// require('dotenv').config();
// const supabase = require('./config/supabaseClient');

// // Test connection
// async function testConnection() {
//   const { data, error } = await supabase
//     .from('foods')
//     .select('*')
//     .limit(1);

//   if (error) console.error('Connection error:', error);
//   else console.log('Successfully connected to Supabase!');
// }

// testConnection();