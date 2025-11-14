import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, product } = req.body;

  // Validate required fields
  if (!email || !product) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Check if environment variables are set
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      console.error('Missing environment variables:', {
        GMAIL_USER: !!process.env.GMAIL_USER,
        GMAIL_APP_PASSWORD: !!process.env.GMAIL_APP_PASSWORD
      });
      
      // Log the notification request and return success
      console.log('Product notification request received (no email sent):', { email, product });
      
      return res.status(200).json({ 
        success: true,
        message: 'Notification request received successfully',
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

    // Determine product details
    const productDetails = {
      'Food': { emoji: '🍖', description: 'Premium nutrition for every life stage' },
      'Accessories': { emoji: '🎾', description: 'Quality toys, collars, beds & more' },
      'Health': { emoji: '💊', description: 'Supplements, vitamins & care products' },
    }[product] || { emoji: '🛍️', description: 'Premium pet products' };

    // Email content
    const subject = `${productDetails.emoji} New Product Interest – ${product}`;
    
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://thePet.Ra's.in/Pet.Ra's-logo-blue-2.png" alt="Pet.Ra's" style="width: 150px; height: auto;" />
        </div>
        <h2 style="color: #171739; border-bottom: 2px solid #FFD447; padding-bottom: 10px;">
          ${productDetails.emoji} New Product Notification Request
        </h2>
        
        <div style="background-color: #FFF9F1; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #FFD447;">
          <h3 style="color: #171739; margin-top: 0;">Product Category: ${product}</h3>
          <p style="color: #6B7280; margin: 5px 0 0 0;">${productDetails.description}</p>
        </div>

        <div style="background-color: #F8FAFC; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">Contact Information</h3>
          <p><strong>Email:</strong> ${email}</p>
        </div>

        <div style="margin-top: 30px; padding: 15px; background-color: #DBEAFE; border-radius: 8px; border-left: 4px solid #3B82F6;">
          <p style="margin: 0; color: #1E40AF; font-weight: 500;">
            💡 This person wants to be notified when ${product} products launch. Add to launch notification list.
          </p>
        </div>

        <hr style="margin: 30px 0; border: none; border-top: 1px solid #E5E7EB;">
        
        <p style="color: #6B7280; font-size: 14px; margin: 0;">
          Submitted at: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}<br/>
          This request was submitted through Pet.Ra's Product Notification form.
        </p>
      </div>
    `;

    // Send email to admin
    const adminMailOptions = {
      from: process.env.GMAIL_USER,
      to: 'Pet.Ra'sgroupofficial@gmail.com',
      replyTo: email,
      subject: subject,
      html: htmlContent,
    };

    console.log('Attempting to send product notification email to admin...');
    const adminResult = await transporter.sendMail(adminMailOptions);
    console.log('Admin email sent successfully:', adminResult.messageId);

    // Send confirmation email to customer
    const customerSubject = `We'll notify you when ${product} products launch! 🛍️`;
    const customerHtmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <img src="https://thePet.Ra's.in/Pet.Ra's-logo-blue-2.png" alt="Pet.Ra's" style="width: 180px; height: auto;" />
        </div>

        <h2 style="color: #171739; margin-bottom: 20px;">
          Thanks for your interest! ${productDetails.emoji}
        </h2>
        
        <p style="color: #374151; line-height: 1.7; font-size: 16px;">
          You've successfully signed up to be notified when our <strong style="color: #171739;">${product}</strong> products launch.
        </p>

        <div style="background: linear-gradient(135deg, #FFF9F1 0%, #FFE9B2 100%); border-left: 4px solid #FFD447; padding: 20px; margin: 25px 0; border-radius: 8px;">
          <p style="margin: 0; color: #171739; font-size: 16px;">
            <strong>${productDetails.emoji} Coming Soon:</strong><br/><br/>
            ${productDetails.description}
          </p>
        </div>

        <p style="color: #374151; line-height: 1.7; font-size: 16px;">
          We're working hard to bring you premium pet essentials that your furry friends will love. 
          You'll receive an email as soon as we launch!
        </p>

        <div style="background: #F0FDF4; border: 2px solid #86EFAC; padding: 15px; margin: 25px 0; border-radius: 8px; text-align: center;">
          <p style="margin: 0; color: #166534; font-size: 15px; font-weight: 600;">
            ✓ You're on the list! We'll email you at launch.
          </p>
        </div>

        <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #E5E7EB; text-align: center;">
          <img src="https://thePet.Ra's.in/Pet.Ra's-logo-blue-2.png" alt="Pet.Ra's" style="width: 120px; height: auto; margin-bottom: 15px;" />
          <p style="color: #6B7280; font-size: 14px; margin: 0;">
            Have questions? Reply to this email or reach us at <a href="mailto:hello@thePet.Ra's.in" style="color: #FFD447; text-decoration: none;">hello@thePet.Ra's.in</a>
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

    return res.status(200).json({ 
      success: true, 
      message: `You'll be notified when ${product} products launch`,
    });

  } catch (error) {
    console.error('Error processing product notification:', error);
    
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
      return res.status(500).json({ message: 'Failed to save notification request. Please try again.' });
    }
  }
}

