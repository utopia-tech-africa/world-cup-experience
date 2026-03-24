import * as React from "react";
import { Section, Heading, Text } from "@react-email/components";
import { BaseLayout } from "./BaseLayout";

interface RejectedEmailProps {
  firstName: string;
  bookingReference: string;
}

export const RejectedEmail = ({
  firstName,
  bookingReference,
}: RejectedEmailProps) => {
  return (
    <BaseLayout previewText="Small delay with your booking verification.">
      <Section className="text-center">
        <Heading className="text-[#1e3a8a] text-[32px] font-bold leading-[1.2em] font-syne mb-[24px] mobile-h1">
          We Hit a Small Delay With Your Booking
        </Heading>

        <Text className="text-[#1A1A1A] text-[15px] leading-[24px] mb-[20px] text-left mobile-text">
          Hi {firstName},
        </Text>

        <Text className="text-[#1A1A1A] text-[15px] leading-[24px] mb-[20px] text-left mobile-text">
          Thank you for booking a World Cup Hosting Package with us. ⚽
        </Text>

        <Text className="text-[#1A1A1A] text-[15px] leading-[24px] mb-[20px] text-left mobile-text">
          We attempted to verify the payment associated with your booking, but
          unfortunately we were unable to confirm the transaction with the
          details provided.
        </Text>

        <Text className="text-[#1A1A1A] text-[15px] text-left mobile-text">
          <span className="font-bold">What this means:</span>
          <br />
          Your booking is currently on hold until the payment can be
          successfully verified.
        </Text>

        <Text className="text-[#1A1A1A] text-[15px] font-bold text-left -mb-[12px] mobile-text">
          What you can do:
        </Text>
        <ul className="text-[#1A1A1A] text-[15px] text-left list-disc pl-[20px] mb-[24px] mobile-text">
          <li className="mb-[8px]">
            Double-check that the payment was completed to the correct account
          </li>
          <li className="mb-[8px]">
            Confirm that the reference or description included your Booking ID:
            <span className="text-nowrap"> [{bookingReference}]</span>
          </li>
          <li className="mb-[8px]">
            If you've already made the payment, please reply to this email with
            proof of payment so our team can review it
          </li>
        </ul>

        <Text className="text-[#1A1A1A] text-[15px] leading-[24px] mb-[20px] text-left mobile-text">
          Once the payment is confirmed, we'll immediately finalize your booking
          and send your full hosting package details.
        </Text>

        <Text className="text-[#1A1A1A] text-[15px] leading-[24px] mb-[24px] text-left mobile-text">
          If you need any assistance, our team is happy to help.
        </Text>

        <Text className="text-[#1A1A1A] text-[15px] leading-[24px] m-0 text-left mobile-text">
          Best regards,
          <br />
          <strong className="text-[#1A1A1A] font-bold">The Altair Team</strong>
        </Text>
      </Section>
    </BaseLayout>
  );
};

RejectedEmail.PreviewProps = {
  firstName: "Ebenezer",
  bookingReference: "WC-2026-DELAY",
} as RejectedEmailProps;

export default RejectedEmail;
