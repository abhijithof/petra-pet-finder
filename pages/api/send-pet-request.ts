import { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  petType: string;
  breedSizePreference: string;
  genderPreference: string;
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
    if (!formData.fullName || !formData.phone || !formData.petType || !formData.breedSizePreference || !formData.genderPreference || !formData.agePreference || !formData.budgetRange || !formData.additionalNotes) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if environment variables are set
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      console.error('Missing environment variables:', {
        GMAIL_USER: !!process.env.GMAIL_USER,
        GMAIL_APP_PASSWORD: !!process.env.GMAIL_APP_PASSWORD
      });
      
      // For now, just log the form data and return success
      console.log('Form submission received (no email sent):', {
        fullName: formData.fullName,
        phone: formData.phone,
        petType: formData.petType,
        email: formData.email,
        budgetRange: formData.budgetRange,
        additionalNotes: formData.additionalNotes
      });
      
      return res.status(200).json({ 
        message: 'Form received successfully. We will contact you soon.',
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

    const submittedAt = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    // ── Admin email ──────────────────────────────────────────────
    const adminHtml = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F3F4F6;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F3F4F6;padding:32px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

  <!-- Header -->
  <tr>
    <td style="background:#0B0C1E;border-radius:16px 16px 0 0;padding:28px 36px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td>
            <span style="display:inline-block;background:#FFD447;color:#0B0C1E;font-size:11px;font-weight:800;letter-spacing:2px;text-transform:uppercase;padding:4px 10px;border-radius:99px;">New Request</span>
            <h1 style="color:#ffffff;font-size:22px;font-weight:800;margin:12px 0 4px;letter-spacing:-0.3px;">Pet Finder Request</h1>
            <p style="color:rgba(255,255,255,0.45);font-size:13px;margin:0;">${submittedAt} &nbsp;·&nbsp; via thepetra.in</p>
          </td>
          <td align="right" style="vertical-align:top;">
            <div style="background:#FFD447;width:44px;height:44px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:20px;line-height:44px;text-align:center;">🐾</div>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- Urgency banner -->
  <tr>
    <td style="background:#FFD447;padding:12px 36px;">
      <p style="margin:0;font-size:13px;font-weight:700;color:#0B0C1E;">⏰ &nbsp;Respond within 24 hours — customer is expecting a match.</p>
    </td>
  </tr>

  <!-- Body -->
  <tr>
    <td style="background:#ffffff;padding:32px 36px;">

      <!-- Contact info -->
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
        <tr>
          <td style="padding-bottom:12px;border-bottom:1px solid #F3F4F6;">
            <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#9CA3AF;">Customer</p>
          </td>
        </tr>
        <tr><td style="padding-top:16px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td width="50%" style="padding-bottom:12px;vertical-align:top;">
                <p style="margin:0 0 3px;font-size:11px;color:#9CA3AF;text-transform:uppercase;letter-spacing:1px;">Full Name</p>
                <p style="margin:0;font-size:15px;font-weight:600;color:#0B0C1E;">${formData.fullName}</p>
              </td>
              <td width="50%" style="padding-bottom:12px;vertical-align:top;">
                <p style="margin:0 0 3px;font-size:11px;color:#9CA3AF;text-transform:uppercase;letter-spacing:1px;">Phone</p>
                <p style="margin:0;font-size:15px;font-weight:600;color:#0B0C1E;">
                  <a href="tel:${formData.phone}" style="color:#0B0C1E;text-decoration:none;">${formData.phone}</a>
                </p>
              </td>
            </tr>
            <tr>
              <td width="50%" style="vertical-align:top;">
                <p style="margin:0 0 3px;font-size:11px;color:#9CA3AF;text-transform:uppercase;letter-spacing:1px;">Email</p>
                <p style="margin:0;font-size:15px;font-weight:600;color:#0B0C1E;">
                  <a href="mailto:${formData.email}" style="color:#30358B;text-decoration:none;">${formData.email || '—'}</a>
                </p>
              </td>
              <td width="50%" style="vertical-align:top;">
                <p style="margin:0 0 3px;font-size:11px;color:#9CA3AF;text-transform:uppercase;letter-spacing:1px;">Location</p>
                <p style="margin:0;font-size:15px;font-weight:600;color:#0B0C1E;">${formData.location || 'Not specified'}</p>
              </td>
            </tr>
          </table>
        </td></tr>
      </table>

      <!-- Pet preferences -->
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
        <tr>
          <td style="padding-bottom:12px;border-bottom:1px solid #F3F4F6;">
            <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#9CA3AF;">Pet Preferences</p>
          </td>
        </tr>
        <tr><td style="padding-top:16px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td width="50%" style="padding-bottom:12px;vertical-align:top;">
                <p style="margin:0 0 3px;font-size:11px;color:#9CA3AF;text-transform:uppercase;letter-spacing:1px;">Pet Type</p>
                <p style="margin:0;font-size:15px;font-weight:700;color:#0B0C1E;">${formData.petType}</p>
              </td>
              <td width="50%" style="padding-bottom:12px;vertical-align:top;">
                <p style="margin:0 0 3px;font-size:11px;color:#9CA3AF;text-transform:uppercase;letter-spacing:1px;">Breed / Size</p>
                <p style="margin:0;font-size:15px;font-weight:600;color:#0B0C1E;">${formData.breedSizePreference || '—'}</p>
              </td>
            </tr>
            <tr>
              <td width="50%" style="padding-bottom:12px;vertical-align:top;">
                <p style="margin:0 0 3px;font-size:11px;color:#9CA3AF;text-transform:uppercase;letter-spacing:1px;">Gender</p>
                <p style="margin:0;font-size:15px;font-weight:600;color:#0B0C1E;">${formData.genderPreference || '—'}</p>
              </td>
              <td width="50%" style="padding-bottom:12px;vertical-align:top;">
                <p style="margin:0 0 3px;font-size:11px;color:#9CA3AF;text-transform:uppercase;letter-spacing:1px;">Age Range</p>
                <p style="margin:0;font-size:15px;font-weight:600;color:#0B0C1E;">${formData.agePreference || '—'}</p>
              </td>
            </tr>
            <tr>
              <td colspan="2">
                <p style="margin:0 0 3px;font-size:11px;color:#9CA3AF;text-transform:uppercase;letter-spacing:1px;">Budget</p>
                <p style="margin:0;font-size:20px;font-weight:800;color:#0B0C1E;">₹${formData.budgetRange?.toLocaleString('en-IN') || '—'}</p>
              </td>
            </tr>
          </table>
        </td></tr>
      </table>

      ${formData.additionalNotes ? `
      <!-- Notes -->
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
        <tr>
          <td style="padding-bottom:12px;border-bottom:1px solid #F3F4F6;">
            <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#9CA3AF;">Customer's Notes</p>
          </td>
        </tr>
        <tr><td style="padding-top:16px;">
          <p style="margin:0;font-size:15px;color:#374151;line-height:1.7;white-space:pre-wrap;background:#F9FAFB;border-left:3px solid #FFD447;padding:14px 16px;border-radius:0 8px 8px 0;">${formData.additionalNotes}</p>
        </td></tr>
      </table>
      ` : ''}

      <!-- Action buttons -->
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:8px;">
        <tr>
          <td style="padding-right:8px;" width="50%">
            <a href="tel:${formData.phone}" style="display:block;background:#0B0C1E;color:#FFD447;font-size:14px;font-weight:700;text-align:center;padding:14px;border-radius:10px;text-decoration:none;">📞 &nbsp;Call Customer</a>
          </td>
          <td style="padding-left:8px;" width="50%">
            <a href="mailto:${formData.email}?subject=Your Pet.Ra Request – We Found Matches!&body=Hi ${encodeURIComponent(formData.fullName)},%0A%0AWe've reviewed your request for a ${encodeURIComponent(formData.petType)} and have some great matches for you!%0A%0A" style="display:block;background:#F3F4F6;color:#0B0C1E;font-size:14px;font-weight:700;text-align:center;padding:14px;border-radius:10px;text-decoration:none;">✉️ &nbsp;Reply by Email</a>
          </td>
        </tr>
      </table>

    </td>
  </tr>

  <!-- Footer -->
  <tr>
    <td style="background:#F9FAFB;border-radius:0 0 16px 16px;padding:20px 36px;border-top:1px solid #E5E7EB;">
      <p style="margin:0;font-size:12px;color:#9CA3AF;text-align:center;">
        Pet.Ra &nbsp;·&nbsp; thepetra.in &nbsp;·&nbsp; Petragroupofficial@gmail.com
      </p>
    </td>
  </tr>

</table>
</td></tr>
</table>
</body>
</html>`;

    // ── Customer confirmation email ──────────────────────────────
    const customerHtml = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F3F4F6;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F3F4F6;padding:32px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

  <!-- Header -->
  <tr>
    <td style="background:#0B0C1E;border-radius:16px 16px 0 0;padding:36px 36px 28px;text-align:center;">
      <div style="display:inline-block;background:#FFD447;width:52px;height:52px;border-radius:50%;line-height:52px;text-align:center;font-size:24px;margin-bottom:16px;">🐾</div>
      <h1 style="color:#ffffff;font-size:24px;font-weight:800;margin:0 0 6px;letter-spacing:-0.3px;">We've got your request!</h1>
      <p style="color:rgba(255,255,255,0.5);font-size:14px;margin:0;">Our team is already on it, ${formData.fullName.split(' ')[0]}.</p>
    </td>
  </tr>

  <!-- Body -->
  <tr>
    <td style="background:#ffffff;padding:36px;">

      <p style="font-size:15px;color:#374151;line-height:1.7;margin:0 0 24px;">
        Thanks for using <strong style="color:#0B0C1E;">Pet.Ra's Pet Finder</strong>. We'll match you with verified breeders who meet your exact requirements and get back to you within <strong>24 hours</strong>.
      </p>

      <!-- Summary card -->
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#F9FAFB;border-radius:12px;border:1px solid #E5E7EB;margin-bottom:28px;">
        <tr>
          <td style="padding:20px 24px 4px;">
            <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#9CA3AF;">Your Request Summary</p>
          </td>
        </tr>
        <tr><td style="padding:12px 24px 20px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding:8px 0;border-bottom:1px solid #E5E7EB;" width="40%">
                <p style="margin:0;font-size:13px;color:#9CA3AF;">Pet Type</p>
              </td>
              <td style="padding:8px 0;border-bottom:1px solid #E5E7EB;">
                <p style="margin:0;font-size:13px;font-weight:600;color:#0B0C1E;">${formData.petType}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 0;border-bottom:1px solid #E5E7EB;">
                <p style="margin:0;font-size:13px;color:#9CA3AF;">Breed / Size</p>
              </td>
              <td style="padding:8px 0;border-bottom:1px solid #E5E7EB;">
                <p style="margin:0;font-size:13px;font-weight:600;color:#0B0C1E;">${formData.breedSizePreference || '—'}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 0;border-bottom:1px solid #E5E7EB;">
                <p style="margin:0;font-size:13px;color:#9CA3AF;">Age Range</p>
              </td>
              <td style="padding:8px 0;border-bottom:1px solid #E5E7EB;">
                <p style="margin:0;font-size:13px;font-weight:600;color:#0B0C1E;">${formData.agePreference || '—'}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 0;">
                <p style="margin:0;font-size:13px;color:#9CA3AF;">Budget</p>
              </td>
              <td style="padding:8px 0;">
                <p style="margin:0;font-size:13px;font-weight:600;color:#0B0C1E;">₹${formData.budgetRange?.toLocaleString('en-IN') || '—'}</p>
              </td>
            </tr>
          </table>
        </td></tr>
      </table>

      <!-- Timeline -->
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
        <tr>
          <td style="padding-bottom:14px;">
            <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#9CA3AF;">What happens next</p>
          </td>
        </tr>
        <tr>
          <td>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td width="32" style="vertical-align:top;padding-top:2px;">
                  <div style="background:#FFD447;width:24px;height:24px;border-radius:50%;text-align:center;line-height:24px;font-size:12px;font-weight:800;color:#0B0C1E;">1</div>
                </td>
                <td style="padding-left:12px;padding-bottom:16px;vertical-align:top;">
                  <p style="margin:0;font-size:14px;font-weight:600;color:#0B0C1E;">Request received ✓</p>
                  <p style="margin:4px 0 0;font-size:13px;color:#6B7280;line-height:1.5;">Your details are with our sourcing team right now.</p>
                </td>
              </tr>
              <tr>
                <td width="32" style="vertical-align:top;padding-top:2px;">
                  <div style="background:#E5E7EB;width:24px;height:24px;border-radius:50%;text-align:center;line-height:24px;font-size:12px;font-weight:800;color:#6B7280;">2</div>
                </td>
                <td style="padding-left:12px;padding-bottom:16px;vertical-align:top;">
                  <p style="margin:0;font-size:14px;font-weight:600;color:#0B0C1E;">Breeder verification</p>
                  <p style="margin:4px 0 0;font-size:13px;color:#6B7280;line-height:1.5;">We check health records, vaccinations, and ethical practices.</p>
                </td>
              </tr>
              <tr>
                <td width="32" style="vertical-align:top;padding-top:2px;">
                  <div style="background:#E5E7EB;width:24px;height:24px;border-radius:50%;text-align:center;line-height:24px;font-size:12px;font-weight:800;color:#6B7280;">3</div>
                </td>
                <td style="padding-left:12px;vertical-align:top;">
                  <p style="margin:0;font-size:14px;font-weight:600;color:#0B0C1E;">You get your matches — within 24h</p>
                  <p style="margin:4px 0 0;font-size:13px;color:#6B7280;line-height:1.5;">3–5 curated pet profiles sent to you via email and WhatsApp.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <!-- Contact strip -->
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#F9FAFB;border-radius:12px;border:1px solid #E5E7EB;padding:20px 24px;">
        <tr>
          <td>
            <p style="margin:0 0 4px;font-size:13px;font-weight:600;color:#0B0C1E;">Have a question in the meantime?</p>
            <p style="margin:0;font-size:13px;color:#6B7280;">
              Reply to this email or WhatsApp us at
              <a href="https://wa.me/919895000000" style="color:#30358B;font-weight:600;text-decoration:none;">+91 98950 00000</a>.
            </p>
          </td>
        </tr>
      </table>

    </td>
  </tr>

  <!-- Footer -->
  <tr>
    <td style="background:#F9FAFB;border-radius:0 0 16px 16px;padding:20px 36px;border-top:1px solid #E5E7EB;">
      <p style="margin:0;font-size:12px;color:#9CA3AF;text-align:center;">
        © Pet.Ra &nbsp;·&nbsp; <a href="https://thepetra.in" style="color:#9CA3AF;">thepetra.in</a> &nbsp;·&nbsp; Kochi, Kerala
      </p>
    </td>
  </tr>

</table>
</td></tr>
</table>
</body>
</html>`;

    // Send admin email
    await transporter.sendMail({
      from: `"Pet.Ra Alerts" <${process.env.GMAIL_USER}>`,
      to: 'Petragroupofficial@gmail.com',
      replyTo: formData.email || undefined,
      subject: `🐾 New ${formData.petType} Request — ${formData.fullName} (${formData.location || 'Kochi'})`,
      html: adminHtml,
    });
    console.log('Admin email sent');

    // Send customer confirmation
    if (formData.email) {
      await transporter.sendMail({
        from: `"Pet.Ra" <${process.env.GMAIL_USER}>`,
        to: formData.email,
        subject: `We've got your request, ${formData.fullName.split(' ')[0]}! 🐾`,
        html: customerHtml,
      });
      console.log('Customer confirmation sent');
    }

    // Send to Google Sheets if URL is configured
    if (process.env.GOOGLE_SHEET_PET_FINDER_URL) {
      try {
        const sheetData = {
          name: formData.fullName,
          email: formData.email || '',
          phone: formData.phone,
          city: formData.location || 'Kochi',
          petType: formData.petType,
          breed: formData.breedSizePreference || '',
          ageRange: formData.agePreference || '',
          budget: `₹${formData.budgetRange?.toLocaleString('en-IN') || 0}`,
          temperament: [], // Empty array so Google Sheets .join() doesn't break
          notes: formData.additionalNotes || ''
        };

        const response = await fetch(process.env.GOOGLE_SHEET_PET_FINDER_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(sheetData)
        });
        
        const responseText = await response.text();
        console.log('Data sent to Google Sheets. Response:', responseText);
        
        if (!response.ok) {
          console.error('Google Sheets returned error:', response.status, responseText);
        }
      } catch (sheetError) {
        console.error('Failed to send to Google Sheets:', sheetError);
        // Don't fail the request if Google Sheets fails
      }
    }

    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    
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
      return res.status(500).json({ message: 'Failed to send email: Unknown error occurred' });
    }
  }
}
