import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, phone, plan } = req.body;

  // Validate required fields
  if (!name || !email || !plan) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Check if environment variables are set
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      console.error('Missing environment variables:', {
        GMAIL_USER: !!process.env.GMAIL_USER,
        GMAIL_APP_PASSWORD: !!process.env.GMAIL_APP_PASSWORD
      });
      
      // Log the waitlist signup and return success
      console.log('Waitlist signup received (no email sent):', { name, email, plan });
      
      return res.status(200).json({ 
        success: true,
        message: 'Waitlist signup received successfully',
        note: 'Email service not configured'
      });
    }

    // Create transporter using Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // Email content
    const subject = `🎉 New Waitlist Signup – ${plan} Plan`;
    
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://thepetra.in/petra-logo-blue-2.png" alt="Pet.Ra's" style="width: 150px; height: auto;" />
        </div>
        <h2 style="color: #171739; border-bottom: 2px solid #FFD447; padding-bottom: 10px;">
          🎉 New Waitlist Signup
        </h2>
        
        <div style="background-color: #FFF9F1; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #FFD447;">
          <h3 style="color: #171739; margin-top: 0;">Plan Interest: ${plan}</h3>
        </div>

        <div style="background-color: #F8FAFC; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">Contact Information</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
        </div>

        <div style="margin-top: 30px; padding: 15px; background-color: #DBEAFE; border-radius: 8px; border-left: 4px solid #3B82F6;">
          <p style="margin: 0; color: #1E40AF; font-weight: 500;">
            💡 This person is interested in early access to ${plan} Plan. Follow up with plan details and launch timeline.
          </p>
        </div>

        <hr style="margin: 30px 0; border: none; border-top: 1px solid #E5E7EB;">
        
        <p style="color: #6B7280; font-size: 14px; margin: 0;">
          Submitted at: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}<br/>
          This request was submitted through Pet.Ra's Subscription Waitlist form.
        </p>
      </div>
    `;

    // Send email to admin
    const adminMailOptions = {
      from: process.env.GMAIL_USER,
      to: 'Petragroupofficial@gmail.com',
      replyTo: email,
      subject: subject,
      html: htmlContent,
    };

    console.log('Attempting to send waitlist email to admin...');
    const adminResult = await transporter.sendMail(adminMailOptions);
    console.log('Admin email sent successfully:', adminResult.messageId);

    // Send confirmation email to customer
    const customerSubject = `You're on the waitlist for ${plan} Plan! 🎉`;
    const customerHtmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <img src="https://thepetra.in/petra-logo-blue-2.png" alt="Pet.Ra's" style="width: 180px; height: auto;" />
        </div>

        <h2 style="color: #171739; margin-bottom: 20px;">
          Welcome to the waitlist, ${name}! 🎉
        </h2>
        
        <p style="color: #374151; line-height: 1.7; font-size: 16px;">
          Thank you for your interest in our <strong style="color: #171739;">${plan} Plan</strong>. 
          You're now on the exclusive early access list!
        </p>

        <div style="background: linear-gradient(135deg, #FFF9F1 0%, #FFE9B2 100%); border-left: 4px solid #FFD447; padding: 20px; margin: 25px 0; border-radius: 8px;">
          <p style="margin: 0; color: #171739; font-size: 16px;">
            <strong>✨ What happens next?</strong><br/><br/>
            • You'll be among the first to know when we launch<br/>
            • Get exclusive early access pricing<br/>
            • Receive detailed plan information before public launch
          </p>
        </div>

        <p style="color: #374151; line-height: 1.7; font-size: 16px;">
          We're working hard to bring you the best pet care experience. Stay tuned for updates!
        </p>

        <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #E5E7EB; text-align: center;">
          <img src="https://thepetra.in/petra-logo-blue-2.png" alt="Pet.Ra's" style="width: 120px; height: auto; margin-bottom: 15px;" />
          <p style="color: #6B7280; font-size: 14px; margin: 0;">
            Have questions? Reply to this email or reach us at <a href="mailto:Petragroupofficial@gmail.com" style="color: #FFD447; text-decoration: none;">Petragroupofficial@gmail.com</a>
          </p>
          <p style="color: #6B7280; font-size: 14px; margin: 10px 0 0 0;">
            <strong style="color: #171739;">Team Pet.Ra's</strong><br/>
            Finding perfect pets, responsibly.
          </p>
        </div>
      </div>
    `;

    const customerMailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: customerSubject,
      html: customerHtmlContent,
    };

    console.log('Attempting to send confirmation email to customer...');
    const customerResult = await transporter.sendMail(customerMailOptions);
    console.log('Customer confirmation email sent successfully:', customerResult.messageId);

    // Send to Google Sheets if URL is configured
    if (process.env.GOOGLE_SHEET_WAITLIST_URL) {
      try {
        const sheetData = {
          name,
          email,
          phone: phone || '',
          plan
        };

        await fetch(process.env.GOOGLE_SHEET_WAITLIST_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(sheetData)
        });
        console.log('Waitlist data sent to Google Sheets successfully');
      } catch (sheetError) {
        console.error('Failed to send to Google Sheets:', sheetError);
        // Don't fail the request if Google Sheets fails
      }
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Successfully joined the waitlist',
    });

  } catch (error) {
    console.error('Error processing waitlist signup:', error);
    
    // More specific error messages
    if (error instanceof Error) {
      if ('code' in error && error.code === 'EAUTH') {
        return res.status(500).json({ message: 'Email authentication failed. Please check credentials.' });
      } else if ('code' in error && error.code === 'ECONNECTION') {
        return res.status(500).json({ message: 'Connection to email server failed.' });
      } else {
        return res.status(500).json({ message: `Failed to send email: ${error.message}` });
      }
    } else {
      return res.status(500).json({ message: 'Failed to join waitlist. Please try again.' });
    }
  }
}

