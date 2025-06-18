require('dotenv').config();
const express = require('express');
const app = express();

const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:5173'
}));

app.use(express.json());

// Routes
app.use('/api/food', require('./routes/food'));
app.use('/api/diet', require('./routes/diet'));

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