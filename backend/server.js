require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/expenses', require('./routes/expenseRoutes'));
app.use((req, res) => res.status(404).json({ message: 'Route not found' }));
app.use((err, req, res, next) => { console.error(err); res.status(500).json({ message: 'Server error' }); });
connectDB().then(() => app.listen(process.env.PORT || 5000, () => console.log('API running')))
  .catch(e => { console.error('DB connection failed:', e.message); process.exit(1); });
