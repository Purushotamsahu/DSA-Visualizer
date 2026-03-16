const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, '../server_debug.log');
const logToFile = (msg) => {
  const timestamp = new Date().toISOString();
  fs.appendFileSync(logFile, `[${timestamp}] ${msg}\n`);
};

// Signup Route
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    logToFile(`Signup attempt for: ${email}`);

    // Check if user already exists
    let user = await User.findOne({ email });
    logToFile('User search finished');
    if (user) {
      logToFile('User already exists');
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    logToFile('Creating new user...');
    user = new User({ name, email, password });
    await user.save();
    logToFile('User saved successfully');

    // Generate JWT
    logToFile('Generating token...');
    if (!process.env.JWT_SECRET) {
      logToFile('ERROR: JWT_SECRET is not defined in environment');
      throw new Error('JWT_SECRET is not defined in environment');
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    logToFile('Token generated');

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    logToFile(`SERVER SIGNUP ERROR: ${error.name} - ${error.message}`);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      logToFile(`Validation Error details: ${messages.join(', ')}`);
      return res.status(400).json({ message: 'Validation Error', details: messages });
    }
    logToFile(error.stack);
    res.status(500).json({ message: 'Server error', details: error.message });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(`Login attempt for: ${email}`);

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in environment');
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('SERVER LOGIN ERROR:', error);
    res.status(500).json({ message: 'Server error', details: error.message });
  }
});

// Get User Route (Verify Token)
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in environment');
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    res.json(user);
  } catch (error) {
    console.error('ME ROUTE ERROR:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
});

module.exports = router;
