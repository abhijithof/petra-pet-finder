import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, phone, city, petType, breed, ageRange, budget, temperament, notes } = req.body;

  // Validate required fields
  if (!name || !email || !city || !petType || !ageRange || !budget) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Prepare email content
    const emailContent = `
      New Pet Finder Request
      
      Contact Information:
      - Name: ${name}
      - Email: ${email}
      - Phone: ${phone || 'Not provided'}
      - City: ${city}
      
      Pet Preferences:
      - Pet Type: ${petType}
      - Breed Preference: ${breed || 'Not specified'}
      - Age Range: ${ageRange}
      - Budget: ₹${budget}
      - Temperament: ${temperament && temperament.length > 0 ? temperament.join(', ') : 'Not specified'}
      
      Additional Notes:
      ${notes || 'None'}
      
      ---
      Submitted at: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
    `;

    // For now, we'll use a simple fetch to a email service
    // You can replace this with Resend, SendGrid, or your preferred service
    
    // Option 1: Using Resend (recommended)
    // Uncomment and add your Resend API key
    /*
    const resendApiKey = process.env.RESEND_API_KEY;
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Pet.Ra's <noreply@thePet.Ra's.in>',
        to: ['hello@thePet.Ra's.in'], // Your admin email
        reply_to: email,
        subject: `New Pet Finder Request from ${name}`,
        text: emailContent,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send email');
    }
    */

    // Option 2: Log to console for testing (temporary)
    console.log('Pet Finder Request Received:', emailContent);

    // Send confirmation email to customer
    /*
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Pet.Ra's <noreply@thePet.Ra's.in>',
        to: [email],
        subject: 'We received your Pet Finder request!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #171739;">Thanks for your request, ${name}!</h2>
            <p style="color: #666; line-height: 1.6;">
              We've received your Pet Finder request and our team is already working on finding the perfect pet for you.
            </p>
            <p style="color: #666; line-height: 1.6;">
              You'll receive curated pet matches within <strong>24 hours</strong> at this email address.
            </p>
            <div style="background: #FFF9F1; border-left: 4px solid #FFD447; padding: 15px; margin: 20px 0;">
              <p style="margin: 0; color: #171739;">
                <strong>What happens next?</strong><br/>
                Our team will verify breeders, check health records, and send you 3-5 curated pet profiles that match your requirements.
              </p>
            </div>
            <p style="color: #666;">
              Best regards,<br/>
              <strong>Team Pet.Ra's</strong>
            </p>
          </div>
        `,
      }),
    });
    */

    return res.status(200).json({ 
      success: true, 
      message: 'Pet finder request received successfully',
      data: { name, email, petType }
    });

  } catch (error) {
    console.error('Error processing pet finder request:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to process request. Please try again.' 
    });
  }
}

