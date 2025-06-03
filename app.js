const express = require('express');
const connectDB = require('./config/db');
require('dotenv').config(); // Load .env first

const app = express();
connectDB();

app.use(express.json());

// Routes
app.use('/api/food', require('./routes/food'));
app.use('/api/diet', require('./routes/diet'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));