import { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  petType: string;
  breedSizePreference: string;
  agePreference: string;
  budgetRange: number;
  location: string;
  additionalNotes: string;
  captcha: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const formData: FormData = req.body;

    // Validate required fields
    if (!formData.fullName || !formData.phone || !formData.petType) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Create transporter using Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER, // petragroupofficial@gmail.com
        pass: process.env.GMAIL_APP_PASSWORD, // App-specific password
      },
    });

    // Email content
    const subject = `New Pet Request – ${formData.petType}`;
    
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #4F46E5; border-bottom: 2px solid #4F46E5; padding-bottom: 10px;">
          🐾 New Pet Request
        </h2>
        
        <div style="background-color: #F8FAFC; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">Contact Information</h3>
          <p><strong>Name:</strong> ${formData.fullName}</p>
          <p><strong>Email:</strong> ${formData.email || 'Not provided'}</p>
          <p><strong>Phone:</strong> ${formData.phone}</p>
          <p><strong>Location:</strong> ${formData.location || 'Not specified'}</p>
        </div>

        <div style="background-color: #F0FDF4; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">Pet Preferences</h3>
          <p><strong>Pet Type:</strong> ${formData.petType}</p>
          <p><strong>Breed/Size:</strong> ${formData.breedSizePreference || 'Not specified'}</p>
          <p><strong>Age Preference:</strong> ${formData.agePreference || 'Not specified'}</p>
          <p><strong>Budget Range:</strong> ₹${formData.budgetRange?.toLocaleString('en-IN') || 'Not specified'}</p>
        </div>

        ${formData.additionalNotes ? `
        <div style="background-color: #FEF3C7; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">Additional Notes</h3>
          <p style="white-space: pre-wrap;">${formData.additionalNotes}</p>
        </div>
        ` : ''}

        <div style="margin-top: 30px; padding: 15px; background-color: #EFF6FF; border-radius: 8px; border-left: 4px solid #4F46E5;">
          <p style="margin: 0; color: #1E40AF; font-weight: 500;">
            ⏰ Please respond to this request within 24 hours as promised to the customer.
          </p>
        </div>

        <hr style="margin: 30px 0; border: none; border-top: 1px solid #E5E7EB;">
        
        <p style="color: #6B7280; font-size: 14px; margin: 0;">
          This request was submitted through Petra's Pet Finder form.
        </p>
      </div>
    `;

    // Send email
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: 'petragroupofficial@gmail.com',
      subject: subject,
      html: htmlContent,
    });

    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send email' });
  }
}
