import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, phone, city, petType, breed, ageRange, budget, temperament, notes } = req.body;

  if (!name || !email || !city || !petType || !ageRange || !budget) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.log('Pet finder request received (email not configured):', { name, email, petType });
    return res.status(200).json({ success: true, message: 'Request received' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
    });

    const temperamentList = Array.isArray(temperament) && temperament.length > 0
      ? temperament.join(', ')
      : 'Not specified';

    const adminHtml = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
        <h2 style="color:#171739;border-bottom:2px solid #FFD447;padding-bottom:10px;">🐾 New Pet Finder Request</h2>
        <div style="background:#F8FAFC;padding:20px;border-radius:8px;margin:20px 0;">
          <h3 style="color:#374151;margin-top:0;">Contact</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
          <p><strong>City:</strong> ${city}</p>
        </div>
        <div style="background:#F0FDF4;padding:20px;border-radius:8px;margin:20px 0;">
          <h3 style="color:#374151;margin-top:0;">Pet Preferences</h3>
          <p><strong>Pet Type:</strong> ${petType}</p>
          <p><strong>Breed/Size:</strong> ${breed || 'Not specified'}</p>
          <p><strong>Age Range:</strong> ${ageRange}</p>
          <p><strong>Budget:</strong> ₹${Number(budget).toLocaleString('en-IN')}</p>
          <p><strong>Temperament:</strong> ${temperamentList}</p>
        </div>
        ${notes ? `<div style="background:#FEF3C7;padding:20px;border-radius:8px;margin:20px 0;"><h3 style="color:#374151;margin-top:0;">Notes</h3><p>${notes}</p></div>` : ''}
        <p style="color:#1E40AF;background:#DBEAFE;padding:15px;border-radius:8px;border-left:4px solid #3B82F6;">
          ⏰ Please respond within 24 hours as promised to the customer.
        </p>
        <p style="color:#6B7280;font-size:14px;margin-top:20px;">
          Submitted: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
        </p>
      </div>`;

    const customerHtml = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
        <div style="text-align:center;margin-bottom:20px;">
          <img src="https://thepetra.in/petra-logo-blue-2.png" alt="Pet.Ra" style="width:150px;" />
        </div>
        <h2 style="color:#171739;">Thanks for your request, ${name}! 🐾</h2>
        <p style="color:#374151;line-height:1.7;">
          We've received your <strong>${petType}</strong> finder request and our team is already sourcing verified matches for you.
        </p>
        <div style="background:#FFF9F1;border-left:4px solid #FFD447;padding:20px;margin:25px 0;border-radius:8px;">
          <strong style="color:#171739;">What happens next?</strong><br/><br/>
          • Our team verifies breeders and health records<br/>
          • You'll receive 3–5 curated pet profiles within <strong>24 hours</strong><br/>
          • We'll call/WhatsApp you at ${phone || 'your registered number'} to confirm
        </div>
        <p style="color:#6B7280;font-size:14px;text-align:center;margin-top:30px;">
          Questions? Email us at <a href="mailto:Petragroupofficial@gmail.com" style="color:#FFD447;">Petragroupofficial@gmail.com</a><br/>
          <strong style="color:#171739;">Team Pet.Ra</strong>
        </p>
      </div>`;

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: 'Petragroupofficial@gmail.com',
      replyTo: email,
      subject: `🐾 New Pet Finder Request – ${petType} (${city})`,
      html: adminHtml,
    });

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: `We received your Pet Finder request! 🐾`,
      html: customerHtml,
    });

    return res.status(200).json({ success: true, message: 'Request sent successfully' });
  } catch (error) {
    console.error('send-pet-finder error:', error);
    if (error instanceof Error && 'code' in error) {
      if (error.code === 'EAUTH')
        return res.status(500).json({ message: 'Email authentication failed. Check Gmail App Password.' });
      if (error.code === 'ECONNECTION')
        return res.status(500).json({ message: 'Could not connect to email server.' });
    }
    return res.status(500).json({ message: 'Failed to send email. Please try again.' });
  }
}
