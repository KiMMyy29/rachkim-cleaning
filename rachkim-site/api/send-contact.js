const nodemailer = require('nodemailer');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { name, email, phone, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Please fill in all required fields.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"Rachkim Website" <${process.env.GMAIL_USER}>`,
    to: process.env.GMAIL_USER,
    replyTo: `${name} <${email}>`,
    subject: `New message from ${name} — Rachkim Website`,
    text: `
New contact form submission from your website.

-----------------------------------------------
Name:    ${name}
Email:   ${email}
Phone:   ${phone || 'Not provided'}
-----------------------------------------------
Message:
${message}
-----------------------------------------------
Sent from: Rachkim Cleaning Services Website
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true, message: 'Thank you! Your message has been sent. We will get back to you within 24 hours.' });
  } catch (error) {
    console.error('Email error:', error);
    return res.status(500).json({ success: false, message: 'Sorry, we could not send your message. Please call or WhatsApp us directly.' });
  }
}
