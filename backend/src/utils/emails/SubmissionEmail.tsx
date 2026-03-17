import * as React from "react";
import { Section, Heading, Text } from "@react-email/components";
import { BaseLayout } from "./BaseLayout";

interface SubmissionEmailProps {
  firstName: string;
  bookingReference: string;
}

export const SubmissionEmail = ({
  firstName,
  bookingReference,
}: SubmissionEmailProps) => {
  return (
    <BaseLayout previewText="Your World Cup booking request has been received.">
      <Section className="text-center">
        <Heading className="text-[#1e3a8a] text-[32px] leading-[1.2em] font-syne mb-[24px] font-bold mobile-h1">
          You're almost ready to take off!
        </Heading>

        <Text className="text-[#1A1A1A] text-[15px] leading-[24px] mb-[20px] text-left mobile-text">
          Hi {firstName},
        </Text>

        <Text className="text-[#1A1A1A] text-[15px] leading-[24px] mb-[10px] text-left mobile-text">
          Thank you for booking your World Cup Hosting Package with us! ⚽{" "}
          <br /> We've successfully received your booking request and our team
          is currently reviewing the information and verifying your payment
          details. This process helps us ensure everything is accurate so your
          experience goes smoothly.
          <br />
          Once verification is complete, you'll receive another email confirming
          your booking along with your full package details.
        </Text>

        <Text className="text-[#1A1A1A] text-[15px] leading-[24px] mb-[24px] text-left font-bold mobile-text">
          Here is your booking reference number:{" "}
          <span className="text-[#1A1A1A] font-normal">{bookingReference}</span>
        </Text>

        <Text className="text-[#1A1A1A] text-[15px] leading-[24px] mb-[20px] text-left mobile-text">
          If you have any questions in the meantime, feel free to reply to this
          email and our team will be happy to assist.
          <br />
          Get ready for an unforgettable World Cup experience!
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

SubmissionEmail.PreviewProps = {
  firstName: "Ebenezer",
  bookingReference: "WC-2026-ABCD",
} as SubmissionEmailProps;

export default SubmissionEmail;
