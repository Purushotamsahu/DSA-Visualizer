const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config({ override: true });

const logFile = path.join(__dirname, 'server_debug.log');
const logToFile = (msg) => {
  const timestamp = new Date().toISOString();
  try {
    fs.appendFileSync(logFile, `[${timestamp}] ${msg}\n`);
  } catch (err) {
    console.error('Logging failed:', err);
  }
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
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  logToFile(`INCOMING REQUEST: ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);

// Admin Route to see user count
app.get('/api/admin/stats', async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    res.json({ userCount });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats' });
  }
});

// Database Connection
if (!process.env.MONGODB_URI) {
  logToFile('FATAL ERROR: MONGODB_URI is not defined in .env file');
  process.exit(1);
}

logToFile(`Attempting to connect to MongoDB: ${process.env.MONGODB_URI}`);
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    logToFile('Successfully connected to MongoDB');
    console.log('Successfully connected to MongoDB');
    const PORT = process.env.PORT || 8888;
    const server = app.listen(PORT, '0.0.0.0', () => {
      logToFile(`Server running on https://dsa-visualizer-h9zi.vercel.app`);
      console.log(`Server running on https://dsa-visualizer-h9zi.vercel.app`);
    });

    server.on('error', (err) => {
      logToFile(`SERVER BIND ERROR: ${err.message}`);
      if (err.code === 'EADDRINUSE') {
        logToFile(`Port ${PORT} is already in use. Try a different port.`);
      }
    });
  })
  .catch(err => {
    logToFile('CRITICAL: MongoDB connection failed!');
    logToFile(err.message);
    logToFile(err.stack);
    console.error('CRITICAL: MongoDB connection failed!');
    console.error(err);
  });
