const fs = require('fs');
const path = require('path');

function log(msg) {
  const t = new Date().toISOString();
  fs.appendFileSync('startup_test.log', `[${t}] ${msg}\n`);
  console.log(msg);
}

log('Test starting...');

try {
  log('Requiring express...');
  const express = require('express');
  log('Express loaded.');

  log('Requiring mongoose...');
  const mongoose = require('mongoose');
  log('Mongoose loaded.');

  log('Requiring bcryptjs...');
  const bcrypt = require('bcryptjs');
  log('Bcryptjs loaded.');

  log('Requiring jsonwebtoken...');
  const jwt = require('jsonwebtoken');
  log('JWT loaded.');

  log('Requiring cors...');
  const cors = require('cors');
  log('CORS loaded.');

  log('Requiring dotenv...');
  const dotenv = require('dotenv');
  log('Dotenv loaded.');

  log('ALL MODULES LOADED SUCCESSFULLY.');
  process.exit(0);
} catch (err) {
  log(`LOAD ERROR: ${err.message}`);
  log(err.stack);
  process.exit(1);
}
