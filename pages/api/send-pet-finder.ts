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
      : null;

    const submittedAt = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
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

  <tr>
    <td style="background:#0B0C1E;border-radius:16px 16px 0 0;padding:28px 36px;">
      <table width="100%" cellpadding="0" cellspacing="0"><tr>
        <td>
          <span style="display:inline-block;background:#FFD447;color:#0B0C1E;font-size:11px;font-weight:800;letter-spacing:2px;text-transform:uppercase;padding:4px 10px;border-radius:99px;">New Request</span>
          <h1 style="color:#ffffff;font-size:22px;font-weight:800;margin:12px 0 4px;letter-spacing:-0.3px;">Pet Finder Request</h1>
          <p style="color:rgba(255,255,255,0.45);font-size:13px;margin:0;">${submittedAt} &nbsp;·&nbsp; via thepetra.in</p>
        </td>
        <td align="right" style="vertical-align:top;">
          <div style="background:#FFD447;width:44px;height:44px;border-radius:50%;line-height:44px;text-align:center;font-size:20px;">🐾</div>
        </td>
      </tr></table>
    </td>
  </tr>

  <tr>
    <td style="background:#FFD447;padding:12px 36px;">
      <p style="margin:0;font-size:13px;font-weight:700;color:#0B0C1E;">⏰ &nbsp;Respond within 24 hours — customer is expecting a match.</p>
    </td>
  </tr>

  <tr>
    <td style="background:#ffffff;padding:32px 36px;">

      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
        <tr><td style="padding-bottom:12px;border-bottom:1px solid #F3F4F6;">
          <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#9CA3AF;">Customer</p>
        </td></tr>
        <tr><td style="padding-top:16px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td width="50%" style="padding-bottom:12px;vertical-align:top;">
                <p style="margin:0 0 3px;font-size:11px;color:#9CA3AF;text-transform:uppercase;letter-spacing:1px;">Full Name</p>
                <p style="margin:0;font-size:15px;font-weight:600;color:#0B0C1E;">${name}</p>
              </td>
              <td width="50%" style="padding-bottom:12px;vertical-align:top;">
                <p style="margin:0 0 3px;font-size:11px;color:#9CA3AF;text-transform:uppercase;letter-spacing:1px;">Phone</p>
                <p style="margin:0;font-size:15px;font-weight:600;color:#0B0C1E;">
                  <a href="tel:${phone}" style="color:#0B0C1E;text-decoration:none;">${phone || '—'}</a>
                </p>
              </td>
            </tr>
            <tr>
              <td width="50%" style="vertical-align:top;">
                <p style="margin:0 0 3px;font-size:11px;color:#9CA3AF;text-transform:uppercase;letter-spacing:1px;">Email</p>
                <p style="margin:0;font-size:15px;font-weight:600;color:#0B0C1E;">
                  <a href="mailto:${email}" style="color:#30358B;text-decoration:none;">${email}</a>
                </p>
              </td>
              <td width="50%" style="vertical-align:top;">
                <p style="margin:0 0 3px;font-size:11px;color:#9CA3AF;text-transform:uppercase;letter-spacing:1px;">City</p>
                <p style="margin:0;font-size:15px;font-weight:600;color:#0B0C1E;">${city}</p>
              </td>
            </tr>
          </table>
        </td></tr>
      </table>

      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
        <tr><td style="padding-bottom:12px;border-bottom:1px solid #F3F4F6;">
          <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#9CA3AF;">Pet Preferences</p>
        </td></tr>
        <tr><td style="padding-top:16px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td width="50%" style="padding-bottom:12px;vertical-align:top;">
                <p style="margin:0 0 3px;font-size:11px;color:#9CA3AF;text-transform:uppercase;letter-spacing:1px;">Pet Type</p>
                <p style="margin:0;font-size:15px;font-weight:700;color:#0B0C1E;">${petType}</p>
              </td>
              <td width="50%" style="padding-bottom:12px;vertical-align:top;">
                <p style="margin:0 0 3px;font-size:11px;color:#9CA3AF;text-transform:uppercase;letter-spacing:1px;">Breed / Size</p>
                <p style="margin:0;font-size:15px;font-weight:600;color:#0B0C1E;">${breed || '—'}</p>
              </td>
            </tr>
            <tr>
              <td width="50%" style="padding-bottom:12px;vertical-align:top;">
                <p style="margin:0 0 3px;font-size:11px;color:#9CA3AF;text-transform:uppercase;letter-spacing:1px;">Age Range</p>
                <p style="margin:0;font-size:15px;font-weight:600;color:#0B0C1E;">${ageRange}</p>
              </td>
              <td width="50%" style="padding-bottom:12px;vertical-align:top;">
                <p style="margin:0 0 3px;font-size:11px;color:#9CA3AF;text-transform:uppercase;letter-spacing:1px;">Budget</p>
                <p style="margin:0;font-size:20px;font-weight:800;color:#0B0C1E;">₹${Number(budget).toLocaleString('en-IN')}</p>
              </td>
            </tr>
            ${temperamentList ? `
            <tr>
              <td colspan="2" style="vertical-align:top;">
                <p style="margin:0 0 3px;font-size:11px;color:#9CA3AF;text-transform:uppercase;letter-spacing:1px;">Temperament</p>
                <p style="margin:0;font-size:15px;font-weight:600;color:#0B0C1E;">${temperamentList}</p>
              </td>
            </tr>` : ''}
          </table>
        </td></tr>
      </table>

      ${notes ? `
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
        <tr><td style="padding-bottom:12px;border-bottom:1px solid #F3F4F6;">
          <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#9CA3AF;">Customer Notes</p>
        </td></tr>
        <tr><td style="padding-top:16px;">
          <p style="margin:0;font-size:15px;color:#374151;line-height:1.7;white-space:pre-wrap;background:#F9FAFB;border-left:3px solid #FFD447;padding:14px 16px;border-radius:0 8px 8px 0;">${notes}</p>
        </td></tr>
      </table>` : ''}

      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding-right:8px;" width="50%">
            <a href="tel:${phone}" style="display:block;background:#0B0C1E;color:#FFD447;font-size:14px;font-weight:700;text-align:center;padding:14px;border-radius:10px;text-decoration:none;">📞 &nbsp;Call Customer</a>
          </td>
          <td style="padding-left:8px;" width="50%">
            <a href="mailto:${email}?subject=Your Pet.Ra Request – We Found Matches!&body=Hi ${encodeURIComponent(name)}," style="display:block;background:#F3F4F6;color:#0B0C1E;font-size:14px;font-weight:700;text-align:center;padding:14px;border-radius:10px;text-decoration:none;">✉️ &nbsp;Reply by Email</a>
          </td>
        </tr>
      </table>

    </td>
  </tr>

  <tr>
    <td style="background:#F9FAFB;border-radius:0 0 16px 16px;padding:20px 36px;border-top:1px solid #E5E7EB;">
      <p style="margin:0;font-size:12px;color:#9CA3AF;text-align:center;">Pet.Ra &nbsp;·&nbsp; thepetra.in &nbsp;·&nbsp; Petragroupofficial@gmail.com</p>
    </td>
  </tr>

</table>
</td></tr>
</table>
</body>
</html>`;

    // ── Customer confirmation email ──────────────────────────────
    const firstName = String(name).split(' ')[0];
    const customerHtml = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F3F4F6;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F3F4F6;padding:32px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

  <tr>
    <td style="background:#0B0C1E;border-radius:16px 16px 0 0;padding:36px 36px 28px;text-align:center;">
      <div style="display:inline-block;background:#FFD447;width:52px;height:52px;border-radius:50%;line-height:52px;text-align:center;font-size:24px;margin-bottom:16px;">🐾</div>
      <h1 style="color:#ffffff;font-size:24px;font-weight:800;margin:0 0 6px;letter-spacing:-0.3px;">We've got your request!</h1>
      <p style="color:rgba(255,255,255,0.5);font-size:14px;margin:0;">Our team is already on it, ${firstName}.</p>
    </td>
  </tr>

  <tr>
    <td style="background:#ffffff;padding:36px;">

      <p style="font-size:15px;color:#374151;line-height:1.7;margin:0 0 24px;">
        Thanks for using <strong style="color:#0B0C1E;">Pet.Ra's Pet Finder</strong>. We'll match you with verified breeders who meet your exact requirements and get back to you within <strong>24 hours</strong>.
      </p>

      <table width="100%" cellpadding="0" cellspacing="0" style="background:#F9FAFB;border-radius:12px;border:1px solid #E5E7EB;margin-bottom:28px;">
        <tr><td style="padding:20px 24px 4px;">
          <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#9CA3AF;">Your Request Summary</p>
        </td></tr>
        <tr><td style="padding:12px 24px 20px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding:8px 0;border-bottom:1px solid #E5E7EB;" width="40%"><p style="margin:0;font-size:13px;color:#9CA3AF;">Pet Type</p></td>
              <td style="padding:8px 0;border-bottom:1px solid #E5E7EB;"><p style="margin:0;font-size:13px;font-weight:600;color:#0B0C1E;">${petType}</p></td>
            </tr>
            <tr>
              <td style="padding:8px 0;border-bottom:1px solid #E5E7EB;"><p style="margin:0;font-size:13px;color:#9CA3AF;">Breed / Size</p></td>
              <td style="padding:8px 0;border-bottom:1px solid #E5E7EB;"><p style="margin:0;font-size:13px;font-weight:600;color:#0B0C1E;">${breed || '—'}</p></td>
            </tr>
            <tr>
              <td style="padding:8px 0;border-bottom:1px solid #E5E7EB;"><p style="margin:0;font-size:13px;color:#9CA3AF;">Age Range</p></td>
              <td style="padding:8px 0;border-bottom:1px solid #E5E7EB;"><p style="margin:0;font-size:13px;font-weight:600;color:#0B0C1E;">${ageRange}</p></td>
            </tr>
            <tr>
              <td style="padding:8px 0;"><p style="margin:0;font-size:13px;color:#9CA3AF;">Budget</p></td>
              <td style="padding:8px 0;"><p style="margin:0;font-size:13px;font-weight:600;color:#0B0C1E;">₹${Number(budget).toLocaleString('en-IN')}</p></td>
            </tr>
          </table>
        </td></tr>
      </table>

      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
        <tr><td style="padding-bottom:14px;">
          <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#9CA3AF;">What happens next</p>
        </td></tr>
        <tr><td>
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
                <p style="margin:0;font-size:14px;font-weight:600;color:#0B0C1E;">Your matches — within 24h</p>
                <p style="margin:4px 0 0;font-size:13px;color:#6B7280;line-height:1.5;">3–5 curated pet profiles sent to you via email and WhatsApp.</p>
              </td>
            </tr>
          </table>
        </td></tr>
      </table>

      <table width="100%" cellpadding="0" cellspacing="0" style="background:#F9FAFB;border-radius:12px;border:1px solid #E5E7EB;">
        <tr><td style="padding:20px 24px;">
          <p style="margin:0 0 4px;font-size:13px;font-weight:600;color:#0B0C1E;">Have a question in the meantime?</p>
          <p style="margin:0;font-size:13px;color:#6B7280;">Reply to this email or reach us at <a href="mailto:Petragroupofficial@gmail.com" style="color:#30358B;font-weight:600;text-decoration:none;">Petragroupofficial@gmail.com</a></p>
        </td></tr>
      </table>

    </td>
  </tr>

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

    await transporter.sendMail({
      from: `"Pet.Ra Alerts" <${process.env.GMAIL_USER}>`,
      to: 'Petragroupofficial@gmail.com',
      replyTo: email,
      subject: `🐾 New ${petType} Request — ${name} (${city})`,
      html: adminHtml,
    });

    await transporter.sendMail({
      from: `"Pet.Ra" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: `We've got your request, ${firstName}! 🐾`,
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
