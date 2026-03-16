const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ override: true });

const logToFile = (msg) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${msg}`);
};

// Catch unhandled errors early
process.on('unhandledRejection', (reason, promise) => {
  logToFile(`UNHANDLED REJECTION: ${reason}`);
  console.error('UNHANDLED REJECTION:', reason);
});

process.on('uncaughtException', (err) => {
  logToFile(`UNCAUGHT EXCEPTION: ${err.message}`);
  logToFile(err.stack);
  console.error('UNCAUGHT EXCEPTION:', err);
  process.exit(1);
});

logToFile('--- Server Starting ---');

const authRoutes = require('./routes/auth');
const contactRoutes = require('./routes/contact');
const User = require('./models/User');

const app = express();

// Middleware
app.use(cors({
  origin: 'https://dsa-visualizer-eight-liard.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

app.use((req, res, next) => {
  logToFile(`INCOMING REQUEST: ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);

// Health Check
app.get('/', (req, res) => {
  res.json({ 
    status: 'online', 
    message: 'DSA Visualizer API is running',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Admin Route to see user count
app.get('/api/admin/stats', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: 'Database connection is not ready' });
    }
    const userCount = await User.countDocuments();
    res.json({ userCount });
  } catch (error) {
    logToFile(`ERROR fetching stats: ${error.message}`);
    res.status(500).json({ message: 'Error fetching stats' });
  }
});

// Database Connection
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  logToFile('WARNING: MONGODB_URI is not defined in environment variables');
  console.warn('WARNING: MONGODB_URI is missing. Database features will fail.');
} else {
  logToFile(`Attempting to connect to MongoDB...`);
  mongoose.connect(MONGODB_URI)
    .then(() => {
      logToFile('Successfully connected to MongoDB');
      console.log('Successfully connected to MongoDB');
    })
    .catch(err => {
      logToFile('CRITICAL: MongoDB connection failed!');
      logToFile(err.message);
      console.error('CRITICAL: MongoDB connection failed!', err.message);
    });
}

const PORT = process.env.PORT || 8888;
const server = app.listen(PORT, '0.0.0.0', () => {
  logToFile(`Server running on port ${PORT}`);
  console.log(`Server running on port ${PORT}`);
});

server.on('error', (err) => {
  logToFile(`SERVER BIND ERROR: ${err.message}`);
});

module.exports = app;
