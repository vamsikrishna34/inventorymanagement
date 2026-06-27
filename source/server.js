require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const app = express();
connectDB();

// Security & Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev')); // Logs requests

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, error: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

// Routes
app.use('/api/categories', require('./routes/categories'));
app.use('/api/warehouses', require('./routes/warehouses'));
app.use('/api/products', require('./routes/products'));

app.get('/', (req, res) => res.json({ message: 'Inventory API running' }));

// 404 Fallback
app.use((req, res) => {
  res.status(404).json({ success: false, error: `Route ${req.originalUrl} not found` });
});

// Global Error Handler (MUST be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🌐 Server running on port ${PORT}`));