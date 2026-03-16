const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const logToFile = (msg) => {
  const timestamp = new Date().toISOString();
  console.log(`[USER_MODEL][${timestamp}] ${msg}`);
};

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    logToFile(`Hashing password for: ${this.email}`);
    this.password = await bcrypt.hash(this.password, 10);
    logToFile('Hashing successful');
    next();
  } catch (err) {
    logToFile(`HASHING ERROR: ${err.message}`);
    next(err);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
