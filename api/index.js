const express = require('express');
const cors = require('cors');

// Import your existing route handlers
const lookupRoute = require('../backend/routes/lookup');
const deliverRoute = require('../backend/routes/deliver');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.VERCEL_URL || process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Routes
app.use('/api', lookupRoute);
app.use('/api', deliverRoute);

// Export for Vercel
module.exports = app;
