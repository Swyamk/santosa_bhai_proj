const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

const lookupLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 20, // limit lookup requests
  message: 'Too many lookup requests, please try again later.'
});

const deliveryLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 10, // limit delivery requests
  message: 'Too many delivery requests, please try again later.'
});

app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Import routes
const lookupRoutes = require('./routes/lookup');
const deliverRoutes = require('./routes/deliver');

// Apply routes with rate limiting
app.use('/api', lookupLimiter, lookupRoutes);
app.use('/api', deliveryLimiter, deliverRoutes);

// Development file serving for local testing
if (process.env.NODE_ENV === 'development') {
  const path = require('path');
  
  // Serve static files for development (simulate Firebase Storage)
  app.get('/api/files/:filename', (req, res) => {
    const filename = req.params.filename;
    
    // In a real scenario, you might serve actual files
    // For demo purposes, return a placeholder response
    res.json({
      message: 'File download (Development Mode)',
      filename: filename,
      note: 'In production, this would be a direct file download from Firebase Storage'
    });
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { details: err.message })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  
  if (process.env.NODE_ENV === 'development') {
    console.log('🔧 Development mode: Using seed data and mock services');
  }
});

module.exports = app;
