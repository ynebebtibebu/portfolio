const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: 'ynebebtibebu9@gmail.com', pass: 'your-app-password' }
});
transporter.sendMail({
  from: 'test@example.com',
  to: 'ynebebtibebu31@gmail.com',
  subject: 'Test',
  text: 'Test email'
}).then(() => console.log('Sent')).catch(err => console.error(err));