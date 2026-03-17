import * as React from "react";
import { Section, Heading, Text } from "@react-email/components";
import { BaseLayout } from "./BaseLayout";

interface DelayEmailProps {
  firstName: string;
  bookingReference: string;
}

export const DelayEmail = ({
  firstName,
  bookingReference,
}: DelayEmailProps) => {
  return (
    <BaseLayout previewText="Small delay with your booking verification.">
      <Section className="px-[32px] pt-[0px] pb-[40px] text-center">
        <Heading className="text-[#1e3a8a] text-[32px] font-bold leading-[1.2em] font-display mb-[24px]">
          We Hit a Small Delay With Your Booking
        </Heading>

        <Text className="text-slate-600 text-[15px] leading-[24px] mb-[20px] text-left">
          Hi {firstName},
        </Text>

        <Text className="text-slate-600 text-[15px] leading-[24px] mb-[20px] text-left">
          Thank you for booking a World Cup Hosting Package with us. ⚽
        </Text>

        <Text className="text-slate-600 text-[15px] leading-[24px] mb-[20px] text-left">
          We attempted to verify the payment associated with your booking, but
          unfortunately we were unable to confirm the transaction with the
          details provided.
        </Text>

        <Text className="text-slate-800 text-[15px] leading-[24px] font-bold text-left mb-[8px]">
          What this means:
        </Text>
        <Text className="text-slate-600 text-[15px] leading-[24px] mb-[20px] text-left">
          Your booking is currently on hold until the payment can be
          successfully verified.
        </Text>

        <Text className="text-slate-800 text-[15px] leading-[24px] font-bold text-left mb-[8px]">
          What you can do:
        </Text>
        <ul className="text-slate-600 text-[14px] leading-[24px] text-left list-disc pl-[20px] mb-[24px]">
          <li className="mb-[8px]">
            Double-check that the payment was completed to the correct account
          </li>
          <li className="mb-[8px]">
            Confirm that the reference or description included your Booking ID:
            [{bookingReference}]
          </li>
          <li className="mb-[8px]">
            If you've already made the payment, please reply to this email with
            proof of payment so our team can review it
          </li>
        </ul>

        <Text className="text-slate-600 text-[15px] leading-[24px] mb-[20px] text-left">
          Once the payment is confirmed, we'll immediately finalize your booking
          and send your full hosting package details.
        </Text>

        <Text className="text-slate-600 text-[15px] leading-[24px] mb-[24px] text-left">
          If you need any assistance, our team is happy to help.
        </Text>

        <Text className="text-slate-600 text-[15px] leading-[24px] m-0 text-left">
          Best regards,
          <br />
          <strong className="text-slate-800 font-bold">The Altair Team</strong>
        </Text>
      </Section>
    </BaseLayout>
  );
};

export default DelayEmail;
