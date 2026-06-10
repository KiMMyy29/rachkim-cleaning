const nodemailer = require('nodemailer');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { name, email, phone, service, area, date, bedrooms, bathrooms, kitchens, living, other, notes } = req.body;

  if (!name || !email || !phone || !service || !area) {
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
    subject: `Quote request from ${name} — Rachkim Website`,
    text: `
New quote request from your website.

===============================================
CONTACT DETAILS
-----------------------------------------------
Name:           ${name}
Email:          ${email}
Phone/WhatsApp: ${phone}
Area/Suburb:    ${area}
Preferred Date: ${date || 'Not specified'}

SERVICE REQUESTED
-----------------------------------------------
Service Type:   ${service}

PROPERTY DETAILS
-----------------------------------------------
Bedrooms:       ${bedrooms || '0'}
Bathrooms:      ${bathrooms || '0'}
Kitchens:       ${kitchens || '0'}
Living Rooms:   ${living || '0'}
Other Areas:    ${other || 'None specified'}

ADDITIONAL NOTES
-----------------------------------------------
${notes || 'None'}
===============================================
Sent from: Rachkim Cleaning Services Website
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true, message: 'Your quote request has been received! We will send you a personalised quote within 24 hours.' });
  } catch (error) {
    console.error('Email error:', error);
    return res.status(500).json({ success: false, message: 'Sorry, we could not send your request. Please call or WhatsApp us directly.' });
  }
}
