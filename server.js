const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Configure CORS
app.use(cors({
  origin: ['http://localhost:5000', 'https://portfolio-abc123.onrender.com']
}));

// Middleware
app.use(express.json());

// Serve static files
app.use('/static', express.static(path.join(__dirname, 'static')));

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'index.html'));
});

// Send Email API
app.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const mailOptions = {
    from: email,
    to: 'ynebebtibebu31@gmail.com',
    subject: `Portfolio Contact from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    replyTo: email
  };

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD
      }
    });
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: `Failed to send message: ${error.message}` });
  }
});

// Serve CV
app.get('/cv', (req, res) => {
  const filePath = path.join(__dirname, 'cv', 'Yinebeb_CV.pdf');
  res.download(filePath, 'Yinebeb_CV.pdf', (err) => {
    if (err) {
      console.error('Error serving CV:', err);
      res.status(404).json({ error: 'CV file not found' });
    }
  });
});

// Fallback route for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'index.html'));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});