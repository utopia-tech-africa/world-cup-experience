import nodemailer from 'nodemailer';
import { Booking } from '@prisma/client';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendSubmissionEmail(booking: Booking) {
  const html = `
    <h1>Your World Cup Experience Booking Has Been Received</h1>
    <p>Dear ${booking.fullName},</p>
    <p>Your booking reference: <strong>${booking.bookingReference}</strong></p>
    <p>We are currently reviewing your payment and will send you a confirmation shortly.</p>
  `;

  await transporter.sendMail({
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: booking.email,
    subject: `Your World Cup Experience Booking Has Been Received - ${booking.bookingReference}`,
    html,
  });
}

export async function sendConfirmationEmail(booking: Booking) {
  const html = `
    <h1>Your World Cup Experience is Confirmed!</h1>
    <p>Dear ${booking.fullName},</p>
    <p>Your booking reference: <strong>${booking.bookingReference}</strong></p>
    <p>Your booking has been confirmed and tickets have been booked.</p>
  `;

  await transporter.sendMail({
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: booking.email,
    subject: `Your World Cup Experience is Confirmed! - ${booking.bookingReference}`,
    html,
  });
}

export async function sendRejectionEmail(booking: Booking) {
  const html = `
    <h1>Update on Your World Cup Experience Booking</h1>
    <p>Dear ${booking.fullName},</p>
    <p>Your booking reference: <strong>${booking.bookingReference}</strong></p>
    <p>Unfortunately, we were unable to process your booking:</p>
    <p><em>${booking.rejectionReason}</em></p>
    <p>Please contact our support team for assistance.</p>
  `;

  await transporter.sendMail({
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: booking.email,
    subject: `Update on Your World Cup Experience Booking - ${booking.bookingReference}`,
    html,
  });
}
