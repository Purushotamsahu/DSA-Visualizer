const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, '../server_debug.log');
const logToFile = (msg) => {
  const timestamp = new Date().toISOString();
  try {
    fs.appendFileSync(logFile, `[CONTACT_ROUTE][${timestamp}] ${msg}\n`);
  } catch (err) {
    console.error('Logging failed:', err);
  }
};

// Contact Route
router.post('/', async (req, res) => {
  const { name, email, category, message } = req.body;
  logToFile(`Contact attempt from: ${email} (${category})`);

  if (!name || !email || !message) {
    logToFile('Validation failed: Missing fields');
    return res.status(400).json({ message: 'Please provide name, email, and message.' });
  }

  // Check if credentials are set
  if (!process.env.EMAIL_PASS || process.env.EMAIL_PASS === 'your_gmail_app_password_here') {
    logToFile('ERROR: EMAIL_PASS is not configured in .env');
    return res.status(500).json({ 
      message: 'Server email configuration is missing. Please enter your Gmail App Password in server/.env',
      details: 'EMAIL_PASS missing or placeholder used'
    });
  }

  try {
    logToFile(`Setting up Nodemailer transporter for ${process.env.EMAIL_USER}`);
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'dsaconnect123@gmail.com',
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: email,
      to: 'dsaconnect123@gmail.com',
      replyTo: email,
      subject: `New Contact Form Submission: ${category}`,
      text: `
        Name: ${name}
        Email: ${email}
        Category: ${category}
        
        Message:
        ${message}
      `,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Category:</strong> ${category}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `
    };

    logToFile('Attempting to send email...');
    await transporter.sendMail(mailOptions);
    logToFile('SUCCESS: Email sent successfully');
    res.status(200).json({ message: 'Message sent successfully!' });
  } catch (error) {
    logToFile(`FAILED: Nodemailer error - ${error.message}`);
    if (error.stack) logToFile(error.stack);
    res.status(500).json({ 
      message: 'Failed to send message. Please ensure you have configured your Gmail App Password correctly.', 
      details: error.message 
    });
  }
});

module.exports = router;
