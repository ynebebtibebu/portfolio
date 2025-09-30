const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors({
  origin: ['http://localhost:5000', 'https://portfolio-abc123.onrender.com'] // Replace with your Render URL
}));
app.use(express.json());
app.use('/static', express.static(path.join(__dirname, 'static')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'index.html'));
});

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
      },
      // Explicit TLS for Gmail
      secure: true, // Use port 465
      port: 465
    });

    // Verify SMTP connection
    await transporter.verify();
    console.log('SMTP connection verified');

    await transporter.sendMail(mailOptions);
    console.log(`Email sent from ${email} to ynebebtibebu31@gmail.com`);
    res.status(200).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error in /contact:', {
      message: error.message,
      code: error.code,
      response: error.response,
      responseCode: error.responseCode
    });
    res.status(500).json({ error: `Failed to send message: ${error.message}` });
  }
});

app.get('/cv', (req, res) => {
  const filePath = path.join(__dirname, 'cv', 'Yinebeb_CV.pdf');
  res.download(filePath, 'Yinebeb_CV.pdf', (err) => {
    if (err) {
      console.error('Error serving CV:', err);
      res.status(404).json({ error: 'CV file not found' });
    }
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});