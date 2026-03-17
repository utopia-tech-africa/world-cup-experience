import { render } from "@react-email/render";
import * as React from "react";
import { Resend } from "resend";
import { Booking } from "@prisma/client";
import { SubmissionEmail } from "../utils/emails/SubmissionEmail";
import { ConfirmationEmail } from "../utils/emails/ConfirmationEmail";
import { DelayEmail } from "../utils/emails/DelayEmail";

const apiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.FROM_EMAIL ?? "onboarding@resend.dev";
const fromName = process.env.FROM_NAME ?? "Altair Logistics";

const resend = apiKey ? new Resend(apiKey) : null;

function fromAddress(): string {
  return fromName ? `${fromName} <${fromEmail}>` : fromEmail;
}

function packageTypeToLabel(packageType: string): string {
  const labels: Record<string, string> = {
    single_game: "Single Game",
    double_game: "Double Game",
    triple_game: "Triple Game",
    quad_game: "Quad Game",
  };
  return (
    labels[packageType] ??
    packageType.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

export async function sendSubmissionEmail(booking: Booking): Promise<void> {
  if (!resend) {
    console.warn("RESEND_API_KEY not set; skipping submission email");
    return;
  }

  const firstName = booking.fullName.split(" ")[0];

  const html = await render(
    React.createElement(SubmissionEmail, {
      firstName,
      bookingReference: booking.bookingReference,
    }),
  );

  await resend.emails.send({
    from: fromAddress(),
    to: [booking.email],
    subject: `You're almost ready to take off! – ${booking.bookingReference}`,
    html,
  });
}

export async function sendConfirmationEmail(booking: Booking): Promise<void> {
  if (!resend) {
    throw new Error("RESEND_API_KEY not set; cannot send confirmation email");
  }

  const firstName = booking.fullName.split(" ")[0];
  const packageLabel = packageTypeToLabel(booking.packageType);

  const html = await render(
    React.createElement(ConfirmationEmail, {
      firstName,
      bookingReference: booking.bookingReference,
      packageLabel,
    }),
  );

  await resend.emails.send({
    from: fromAddress(),
    to: [booking.email],
    subject: `You’re Cleared for Takeoff! – ${booking.bookingReference}`,
    html,
  });
}

export async function sendRejectionEmail(
  booking: Booking,
  rejectionReason: string,
): Promise<void> {
  if (!resend) {
    throw new Error("RESEND_API_KEY not set; cannot send rejection email");
  }

  const firstName = booking.fullName.split(" ")[0];

  const html = await render(
    React.createElement(DelayEmail, {
      firstName,
      bookingReference: booking.bookingReference,
    }),
  );

  await resend.emails.send({
    from: fromAddress(),
    to: [booking.email],
    subject: `Update on your booking – ${booking.bookingReference}`,
    html,
  });
}
