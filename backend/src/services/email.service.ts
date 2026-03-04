import { Resend } from 'resend';
import { Booking } from '@prisma/client';

const apiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.FROM_EMAIL ?? 'onboarding@resend.dev';
const fromName = process.env.FROM_NAME ?? 'Altair Logistics';

const resend = apiKey ? new Resend(apiKey) : null;

function fromAddress(): string {
  return fromName ? `${fromName} <${fromEmail}>` : fromEmail;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatCurrency(value: number | string): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

function packageTypeToLabel(packageType: string): string {
  const labels: Record<string, string> = {
    single_game: 'Single Game',
    double_game: 'Double Game',
    triple_game: 'Triple Game',
    quad_game: 'Quad Game',
  };
  return labels[packageType] ?? packageType.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function emailLayout(content: string, preheader?: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${preheader ? `<meta name="description" content="${escapeHtml(preheader)}">` : ''}
  <title>World Cup Experience</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f5; line-height: 1.6;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); overflow: hidden;">
      <tr>
        <td style="padding: 32px 40px 24px; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); text-align: center;">
          <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;">⚽ World Cup Experience</h1>
          <p style="margin: 6px 0 0; color: #94a3b8; font-size: 13px;">Altair Logistics</p>
        </td>
      </tr>
      <tr>
        <td style="padding: 32px 40px 40px;">
          ${content}
        </td>
      </tr>
      <tr>
        <td style="padding: 20px 40px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center;">
          <p style="margin: 0; color: #64748b; font-size: 12px;">Thank you for choosing us. We can’t wait to make your experience unforgettable.</p>
          <p style="margin: 8px 0 0; color: #94a3b8; font-size: 11px;">© ${new Date().getFullYear()} Altair Logistics. All rights reserved.</p>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>`;
}

export async function sendSubmissionEmail(booking: Booking): Promise<void> {
  if (!resend) {
    console.warn('RESEND_API_KEY not set; skipping submission email');
    return;
  }

  const totalFormatted = formatCurrency(Number(booking.totalAmount));
  const packageLabel = packageTypeToLabel(booking.packageType);
  const accommodationLabel =
    booking.accommodationType === 'hotel' ? 'Hotel' : 'Hostel';

  const content = `
    <p style="margin: 0 0 24px; color: #1e293b; font-size: 16px;">Hi ${escapeHtml(booking.fullName)},</p>
    <p style="margin: 0 0 24px; color: #475569; font-size: 15px;">Thank you so much for your booking! We’ve received your request and are reviewing everything with care.</p>
    
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin: 24px 0; background-color: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
      <tr>
        <td style="padding: 20px 24px;">
          <p style="margin: 0 0 8px; color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Booking reference</p>
          <p style="margin: 0; color: #1e293b; font-size: 18px; font-weight: 600; letter-spacing: 0.5px;">${escapeHtml(booking.bookingReference)}</p>
        </td>
      </tr>
      <tr>
        <td style="padding: 0 24px 20px;">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
            <tr><td style="padding: 4px 0; color: #64748b; font-size: 14px;">Package</td><td style="text-align: right; color: #1e293b; font-size: 14px;">${escapeHtml(packageLabel)}</td></tr>
            <tr><td style="padding: 4px 0; color: #64748b; font-size: 14px;">Accommodation</td><td style="text-align: right; color: #1e293b; font-size: 14px;">${escapeHtml(accommodationLabel)}</td></tr>
            <tr><td style="padding: 4px 0; color: #64748b; font-size: 14px;">Travelers</td><td style="text-align: right; color: #1e293b; font-size: 14px;">${booking.numberOfTravelers}</td></tr>
            <tr><td style="padding: 8px 0 4px; color: #64748b; font-size: 14px;">Total amount</td><td style="text-align: right; color: #1e293b; font-size: 16px; font-weight: 600;">${totalFormatted}</td></tr>
          </table>
        </td>
      </tr>
    </table>

    <p style="margin: 0 0 16px; color: #475569; font-size: 15px;">We’re checking your payment and details and will send you a confirmation email as soon as everything is approved—usually within a few business days.</p>
    <p style="margin: 0; color: #475569; font-size: 15px;">If you have any questions in the meantime, just reply to this email. We’re here to help! 💚</p>
  `;

  await resend.emails.send({
    from: fromAddress(),
    to: [booking.email],
    subject: `We’ve received your booking – ${booking.bookingReference}`,
    html: emailLayout(content, `Your World Cup Experience booking ${booking.bookingReference} has been received.`),
  });
}

export async function sendConfirmationEmail(booking: Booking): Promise<void> {
  if (!resend) {
    throw new Error('RESEND_API_KEY not set; cannot send confirmation email');
  }

  const totalFormatted = formatCurrency(Number(booking.totalAmount));
  const packageLabel = packageTypeToLabel(booking.packageType);
  const accommodationLabel =
    booking.accommodationType === 'hotel' ? 'Hotel' : 'Hostel';

  const content = `
    <p style="margin: 0 0 24px; color: #1e293b; font-size: 16px;">Hi ${escapeHtml(booking.fullName)},</p>
    <p style="margin: 0 0 24px; color: #475569; font-size: 15px;">Great news—your World Cup Experience is <strong style="color: #059669;">confirmed</strong>! 🎉 We’re so excited to have you with us.</p>
    
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin: 24px 0; background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border-radius: 8px; border: 1px solid #a7f3d0;">
      <tr>
        <td style="padding: 24px; text-align: center;">
          <p style="margin: 0 0 4px; color: #047857; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Booking reference</p>
          <p style="margin: 0; color: #065f46; font-size: 20px; font-weight: 700; letter-spacing: 0.5px;">${escapeHtml(booking.bookingReference)}</p>
          <p style="margin: 12px 0 0; color: #047857; font-size: 14px;">✓ Confirmed</p>
        </td>
      </tr>
    </table>

    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin: 24px 0; background-color: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
      <tr>
        <td style="padding: 20px 24px;">
          <p style="margin: 0 0 12px; color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Your booking details</p>
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
            <tr><td style="padding: 6px 0; color: #64748b; font-size: 14px;">Package</td><td style="text-align: right; color: #1e293b; font-size: 14px;">${escapeHtml(packageLabel)}</td></tr>
            <tr><td style="padding: 6px 0; color: #64748b; font-size: 14px;">Accommodation</td><td style="text-align: right; color: #1e293b; font-size: 14px;">${escapeHtml(accommodationLabel)}</td></tr>
            <tr><td style="padding: 6px 0; color: #64748b; font-size: 14px;">Travelers</td><td style="text-align: right; color: #1e293b; font-size: 14px;">${booking.numberOfTravelers}</td></tr>
            <tr><td style="padding: 10px 0 6px; color: #64748b; font-size: 14px;">Total paid</td><td style="text-align: right; color: #1e293b; font-size: 16px; font-weight: 600;">${totalFormatted}</td></tr>
          </table>
        </td>
      </tr>
    </table>

    <p style="margin: 0 0 16px; color: #475569; font-size: 15px;">Your tickets and further instructions will be sent to you closer to the event. Keep this email safe—you may need your reference number when you travel.</p>
    <p style="margin: 0; color: #475569; font-size: 15px;">See you at the World Cup! ⚽</p>
  `;

  await resend.emails.send({
    from: fromAddress(),
    to: [booking.email],
    subject: `You’re confirmed! – ${booking.bookingReference}`,
    html: emailLayout(content, `Your World Cup Experience booking ${booking.bookingReference} is confirmed.`),
  });
}

export async function sendRejectionEmail(
  booking: Booking,
  rejectionReason: string
): Promise<void> {
  if (!resend) {
    throw new Error('RESEND_API_KEY not set; cannot send rejection email');
  }

  const content = `
    <p style="margin: 0 0 24px; color: #1e293b; font-size: 16px;">Hi ${escapeHtml(booking.fullName)},</p>
    <p style="margin: 0 0 24px; color: #475569; font-size: 15px;">Thank you for your interest in the World Cup Experience. We’ve carefully reviewed your booking request, and we’re sorry to let you know that we weren’t able to approve it this time.</p>
    
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin: 24px 0; background-color: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
      <tr>
        <td style="padding: 20px 24px;">
          <p style="margin: 0 0 8px; color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Booking reference</p>
          <p style="margin: 0; color: #1e293b; font-size: 18px; font-weight: 600; letter-spacing: 0.5px;">${escapeHtml(booking.bookingReference)}</p>
        </td>
      </tr>
    </table>

    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin: 24px 0; background-color: #fef2f2; border-radius: 8px; border: 1px solid #fecaca;">
      <tr>
        <td style="padding: 24px;">
          <p style="margin: 0 0 8px; color: #991b1b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Reason</p>
          <p style="margin: 0; color: #7f1d1d; font-size: 15px; line-height: 1.5;">${escapeHtml(rejectionReason)}</p>
        </td>
      </tr>
    </table>

    <p style="margin: 0 0 16px; color: #475569; font-size: 15px;">If you believe this was a mistake or you’d like to provide additional information, please reply to this email or contact our support team. We’re happy to look into it and, where possible, suggest alternatives.</p>
    <p style="margin: 0; color: #475569; font-size: 15px;">We hope we can welcome you on a future experience.</p>
  `;

  await resend.emails.send({
    from: fromAddress(),
    to: [booking.email],
    subject: `Update on your booking – ${booking.bookingReference}`,
    html: emailLayout(content, `An update on your World Cup Experience booking ${booking.bookingReference}.`),
  });
}
